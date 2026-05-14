import os
import time
from collections import Counter
from PIL import Image
import torch
from torchvision import transforms, datasets
from torch.utils.data import DataLoader, Dataset


# 📐 GÖRÜNTÜ BOYUTU

IMG_SIZE = 224


# 🔄 VERİ DÖNÜŞÜMLER (TRANSFORMS)

def get_transforms():
    """
    Train ve val/test için ayrı transform pipeline'ları döndürür.
    
    Train: Agresif augmentation (RandAugment + RandomErasing + Flip)
    Val/Test: Deterministik merkez kırpma (Swin-T standardı)
    """
    normalize = transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )

    train_transform = transforms.Compose([
        # Scale=(0.7, 1.0): Hastalık bölgelerinin kesilmemesi için biraz geniş tutuldu
        transforms.RandomResizedCrop(IMG_SIZE, scale=(0.7, 1.0)),
        # RandAugment: Renk, keskinlik, döndürme vb. otomatik augmentation
        transforms.RandAugment(num_ops=2, magnitude=9),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.ToTensor(),
        # RandomErasing: Modelin tüm görüntüye değil parçalara odaklanmasını sağlar
        transforms.RandomErasing(p=0.25, scale=(0.02, 0.33), ratio=(0.3, 3.3)),
        normalize,
    ])

    val_test_transform = transforms.Compose([
        # 256 → 224: Swin Transformer test standardı (kenar bilgisi korunur)
        transforms.Resize(256),
        transforms.CenterCrop(IMG_SIZE),
        transforms.ToTensor(),
        normalize,
    ])

    return train_transform, val_test_transform



def robust_pil_loader(path: str):
    """
    OneDrive / Antivirüs vb. kısa süreli dosya kilitlemelerini aşmak için
    hata durumunda yeniden deneyen (retry) güvenli görüntü okuyucu.
    Bozuk görüntüler None yerine hata fırlatır → DataLoader skip eder.
    """
    max_retries = 3
    for attempt in range(max_retries):
        try:
            with open(path, "rb") as f:
                img = Image.open(f)
                return img.convert("RGB")
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(0.5)
            else:
                raise e



class RemappedImageFolder(datasets.ImageFolder):
    """
    datasets.ImageFolder'ı genişletir.
    
    Sorun:
        Valid klasöründe 'blast_test_valid' isimli bir klasör var.
        Bu klasör aslında 'Blast' sınıfına aittir.
        ImageFolder bu iki klasörü farklı sınıf olarak okur.
    
    Çözüm:
        class_to_idx oluşturulurken belirtilen sınıf adları yeniden eşlenir.
        Bu sayede valid loader, train loader ile aynı sınıf indekslerini kullanır.
    
    Args:
        remap (dict): {"eski_klasör_adı": "doğru_sınıf_adı"}
        canonical_class_to_idx (dict): Train setinden gelen class→idx eşlemesi.
                                       None ise kendi içinden üretir.
    """

    def __init__(self, root, transform=None, loader=robust_pil_loader,
                 remap=None, canonical_class_to_idx=None):
        super().__init__(root=root, transform=transform, loader=loader)
        self.remap = remap or {}
        
        if self.remap or canonical_class_to_idx:
            self._apply_remap(canonical_class_to_idx)

    def _apply_remap(self, canonical_class_to_idx):
        """
        Sınıf adlarını ve indekslerini yeniden eşler.
        """
        # 1. Yeni class_to_idx oluştur
        if canonical_class_to_idx:
            # Train setinin sınıf indekslerini kullan (tutarlılık için kritik)
            new_class_to_idx = canonical_class_to_idx
        else:
            new_class_to_idx = {}
            for cls in self.classes:
                canonical_name = self.remap.get(cls, cls)
                new_class_to_idx[canonical_name] = new_class_to_idx.get(
                    canonical_name, len(new_class_to_idx)
                )

        self.class_to_idx = new_class_to_idx

        # 2. Her örneğin etiketini yeni indekse çevir
        remapped_samples = []
        skipped = 0
        for path, old_idx in self.samples:
            # Eski indeksten eski sınıf adını bul
            old_class = self.classes[old_idx]
            # Remap varsa yeni adı al
            new_class = self.remap.get(old_class, old_class)
            # Yeni canonical indeksi al
            if new_class in new_class_to_idx:
                new_idx = new_class_to_idx[new_class]
                remapped_samples.append((path, new_idx))
            else:
                skipped += 1
                print(f"⚠️  '{new_class}' canonical_class_to_idx'te bulunamadı, atlandı: {path}")

        self.samples = remapped_samples
        self.targets = [s[1] for s in self.samples]
        self.classes = list(new_class_to_idx.keys())

        if skipped > 0:
            print(f"⚠️  Toplam {skipped} örnek atlandı (eşleşme bulunamadı)")



def compute_class_weights(targets, num_classes):
    """
    Dengesiz veri seti için class weights hesaplar.
    
    Formül: total_samples / (num_classes * class_count)
    
    "Stem fly" gibi az örnekli sınıflar otomatik olarak daha yüksek
    ağırlık alır → kayıp fonksiyonu bu sınıflara daha fazla odaklanır.
    
    Args:
        targets (list[int]): Her örneğin sınıf indeksi
        num_classes (int): Toplam sınıf sayısı
    
    Returns:
        torch.FloatTensor: [num_classes] boyutunda ağırlık tensörü
    """
    label_counts = Counter(targets)
    total_samples = len(targets)

    class_weights = []
    for i in range(num_classes):
        count = label_counts.get(i, 1)  # 0'a bölmeyi önle
        weight = total_samples / (num_classes * count)
        class_weights.append(weight)

    return torch.FloatTensor(class_weights)



def get_dataloaders(
    data_dir: str,
    batch_size: int = 32,
    num_workers: int = 2,
    pin_memory: bool = True,
    valid_remap: dict = None,
):
    """
    Train, valid ve test setleri için PyTorch DataLoader'larını oluşturur.
    
    Args:
        data_dir (str)      : Ana veri klasörü (içinde train/valid/test olmalı)
        batch_size (int)    : Batch boyutu
        num_workers (int)   : Paralel veri okuma işçi sayısı
        pin_memory (bool)   : GPU transfer hızlandırma
        valid_remap (dict)  : Valid klasörü için sınıf adı düzeltme sözlüğü
                              Örnek: {"blast_test_valid": "Blast"}
    
    Returns:
        train_loader, valid_loader, test_loader,
        class_to_idx (dict), class_weights (Tensor)
    """
    train_dir = os.path.join(data_dir, "train")
    valid_dir = os.path.join(data_dir, "valid")
    test_dir  = os.path.join(data_dir, "test")

    # Dizin varlık kontrolü
    for d, name in [(train_dir, "train"), (valid_dir, "valid"), (test_dir, "test")]:
        if not os.path.isdir(d):
            raise FileNotFoundError(
                f"❌ '{name}' klasörü bulunamadı: {d}\n"
                f"   Beklenen yapı: {data_dir}/train | valid | test"
            )

    train_transform, val_test_transform = get_transforms()

    # 1. TRAIN DATASET
    train_dataset = datasets.ImageFolder(
        root=train_dir,
        transform=train_transform,
        loader=robust_pil_loader,
    )
    class_to_idx = train_dataset.class_to_idx

    print(f"✅ Train sınıfları ({len(class_to_idx)} adet):")
    for cls, idx in sorted(class_to_idx.items(), key=lambda x: x[1]):
        count = train_dataset.targets.count(idx)
        print(f"   [{idx:2d}] {cls:<25} → {count} görsel")

    # 2. VALID DATASET (Remap ile)
    # Varsayılan remap: blast_test_valid → Blast
    if valid_remap is None:
        valid_remap = {"blast_test_valid": "Blast"}

    valid_dataset = RemappedImageFolder(
        root=valid_dir,
        transform=val_test_transform,
        remap=valid_remap,
        canonical_class_to_idx=class_to_idx,  # Train indeksleriyle senkronize
    )
    print(f"\n✅ Valid sınıfları ({len(valid_dataset.class_to_idx)} adet) — "
          f"Remap uygulandı: {valid_remap}")

    # 3. TEST DATASET
    test_dataset = datasets.ImageFolder(
        root=test_dir,
        transform=val_test_transform,
        loader=robust_pil_loader,
    )
    print(f"\n✅ Test sınıfları ({len(test_dataset.class_to_idx)} adet)")

    # 4. CLASS WEIGHTS (Dengesizlik için)
    class_weights = compute_class_weights(
        targets=train_dataset.targets,
        num_classes=len(class_to_idx)
    )
    print(f"\n⚖️  Class Weights hesaplandı:")
    idx_to_class = {v: k for k, v in class_to_idx.items()}
    for i, w in enumerate(class_weights):
        print(f"   [{i:2d}] {idx_to_class[i]:<25} → weight: {w:.4f}")

    # 5. DATALOADERS
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=pin_memory,
        drop_last=True,          # Son eksik batch'i at (BatchNorm için önemli)
    )

    valid_loader = DataLoader(
        valid_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=pin_memory,
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=pin_memory,
    )

    print(f"\n📦 DataLoader'lar hazır:")
    print(f"   • Train  : {len(train_loader)} batch  ({len(train_dataset)} görsel)")
    print(f"   • Valid  : {len(valid_loader)} batch  ({len(valid_dataset)} görsel)")
    print(f"   • Test   : {len(test_loader)} batch  ({len(test_dataset)} görsel)")

    return train_loader, valid_loader, test_loader, class_to_idx, class_weights



if __name__ == "__main__":
    import sys
    from pathlib import Path

    current_dir = Path(__file__).resolve().parent
    project_root = current_dir.parent
    data_path = project_root / "data"

    print(f"Veri yolu: {data_path}")

    tl, vl, tsl, classes, weights = get_dataloaders(
        data_dir=str(data_path),
        batch_size=8,
        num_workers=0,
        pin_memory=False,
    )

    print(f"\nEğitim Batch Sayısı : {len(tl)}")
    print(f"Validasyon Batch    : {len(vl)}")
    print(f"Test Batch          : {len(tsl)}")
    print(f"Sınıflar            : {classes}")
    print(f"Class Weights       : {weights}")

    # Bir batch test et
    images, labels = next(iter(tl))
    print(f"\nBatch shape  : {images.shape}")
    print(f"Labels sample: {labels[:8].tolist()}")