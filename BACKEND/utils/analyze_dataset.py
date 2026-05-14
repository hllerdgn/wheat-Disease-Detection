import os
import ssl
from collections import Counter

# To avoid ssl issues if any downloading happened in the future
ssl._create_default_https_context = ssl._create_unverified_context

def analyze_dataset(data_dir):
    print(f"Veri Seti Analizi Başlıyor: {data_dir}\n" + "="*40)
    
    splits = ['train', 'valid', 'test']
    total_images = 0
    
    for split in splits:
        split_dir = os.path.join(data_dir, split)
        if not os.path.exists(split_dir):
            print(f"[UYARI] {split} klasörü bulunamadı!")
            continue
            
        print(f"\n--- {split.upper()} Klasörü Sınıf Dağılımı ---")
        class_counts = {}
        split_total = 0
        
        for class_name in os.listdir(split_dir):
            class_path = os.path.join(split_dir, class_name)
            if os.path.isdir(class_path):
                # Count only image files roughly
                images = [f for f in os.listdir(class_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
                count = len(images)
                class_counts[class_name] = count
                split_total += count
                
        # Print sorted by count
        for class_name, count in sorted(class_counts.items(), key=lambda item: item[1], reverse=True):
            print(f"  {class_name.ljust(25)}: {count} görsel")
            
        print(f"-> Toplam {split.upper()} Görseli: {split_total}")
        total_images += split_total
        
    print("\n" + "="*40)
    print(f"Toplanan Veri Seti Toplam Büyüklüğü (Tüm Görseller): {total_images}")

if __name__ == "__main__":
    # Script dosyasının bulunduğu klasöre göre 'data' klasörünün tam yolunu buluyoruz
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    data_path = os.path.join(project_root, "data")
    
    analyze_dataset(data_path)

