import torch
import torch.nn as nn
from torchvision.models import swin_t, Swin_T_Weights


# ============================================================================
# 🤖 MODEL: SWIN TRANSFORMER WHEAT DISEASE CLASSIFIER
# ============================================================================

class WheatDiseaseClassifier(nn.Module):
    """
    Swin Transformer Tiny tabanlı buğday hastalığı sınıflandırıcı.

    Mimari:
        - Backbone : Swin-T (ImageNet pre-trained)
        - Head     : LayerNorm → Linear(768→512) → GELU → Dropout → Linear(512→num_classes)

    Fine-tuning Stratejisi:
        Aşama 1 (Epoch 1-4) : Backbone dondurulur, yalnızca head eğitilir.
        Aşama 2 (Epoch 5+)  : Backbone açılır, differential LR uygulanır.
    """

    def __init__(self, num_classes: int, model_name: str = "swin_t", pretrained: bool = True):
        super(WheatDiseaseClassifier, self).__init__()

        self.num_classes = num_classes
        self.model_name  = model_name

        # ── Backbone ──────────────────────────────────────────────────────────
        if pretrained:
            self.base_model = swin_t(weights=Swin_T_Weights.DEFAULT)
        else:
            self.base_model = swin_t(weights=None)

        # ── Sınıflandırma Kafası ──────────────────────────────────────────────
        # Swin-T çıkış boyutu: 768
        num_features = self.base_model.head.in_features

        self.base_model.head = nn.Sequential(
            nn.LayerNorm(num_features),
            nn.Linear(num_features, 512),
            nn.GELU(),
            nn.Dropout(p=0.3),
            nn.Linear(512, num_classes),
        )

    # ── Forward ───────────────────────────────────────────────────────────────

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.base_model(x)

    # ── Fine-tuning Yardımcıları ──────────────────────────────────────────────

    def freeze_backbone(self):
        """Backbone'u dondurur — yalnızca head eğitilir (Aşama 1)."""
        for param in self.base_model.features.parameters():
            param.requires_grad = False
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        print(f"🔒 Backbone donduruldu. Eğitilebilir parametre: {trainable:,}")

    def unfreeze_backbone(self):
        """Backbone'u açar — tüm model eğitilir (Aşama 2)."""
        for param in self.base_model.features.parameters():
            param.requires_grad = True
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        print(f"🔓 Backbone açıldı. Eğitilebilir parametre: {trainable:,}")

    def get_param_groups(self, head_lr: float, backbone_lr: float) -> list:
        """
        Differential LR için parametre grupları döndürür.

        Args:
            head_lr    : Sınıflandırma kafası öğrenme hızı
            backbone_lr: Backbone öğrenme hızı (genellikle head_lr / 10)

        Returns:
            list[dict]: AdamW'ye doğrudan geçilebilecek parametre grupları
        """
        return [
            {
                "params": self.base_model.features.parameters(),
                "lr": backbone_lr,
                "name": "backbone",
            },
            {
                "params": self.base_model.head.parameters(),
                "lr": head_lr,
                "name": "head",
            },
        ]

    # ── Model Bilgisi ─────────────────────────────────────────────────────────

    def model_summary(self):
        """Parametre sayılarını yazdırır."""
        total     = sum(p.numel() for p in self.parameters())
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        frozen    = total - trainable
        print(f"\n{'─'*50}")
        print(f"  Model          : {self.model_name}")
        print(f"  Num Classes    : {self.num_classes}")
        print(f"  Total Params   : {total:,}")
        print(f"  Trainable      : {trainable:,}")
        print(f"  Frozen         : {frozen:,}")
        print(f"{'─'*50}\n")


# ============================================================================
# 🧪 TEST
# ============================================================================

if __name__ == "__main__":
    model = WheatDiseaseClassifier(num_classes=15, pretrained=False)
    model.model_summary()

    # Freeze testi
    model.freeze_backbone()
    model.model_summary()

    # Unfreeze testi
    model.unfreeze_backbone()
    model.model_summary()

    # Forward pass testi
    dummy = torch.randn(2, 3, 224, 224)
    out   = model(dummy)
    print(f"Output shape: {out.shape}")   # [2, 15]
    assert out.shape == (2, 15), "❌ Output shape yanlış!"
    print("✅ Model forward pass başarılı.")