import os
import zipfile
from pathlib import Path

def download_kaggle_dataset():
    """
    Downloads the Wheat Plant Diseases dataset from Kaggle using the Kaggle API.
    Requirements:
    1. pip install kaggle
    2. Place kaggle.json in ~/.kaggle/ (or C:/Users/YourUser/.kaggle/)
    """
    dataset_slug = "kushagra3204/wheat-plant-diseases"
    
    # Path setup
    backend_dir = Path(__file__).resolve().parent.parent
    target_dir = backend_dir / "data"
    target_dir.mkdir(parents=True, exist_ok=True)

    print(f"🚀 Dataset indiriliyor: {dataset_slug}")
    
    try:
        import kaggle
    except ImportError:
        print("❌ Hata: 'kaggle' kütüphanesi yüklü değil. 'pip install kaggle' komutunu çalıştırın.")
        return

    try:
        # Download as zip
        kaggle.api.dataset_download_files(dataset_slug, path=target_dir, unzip=True)
        print(f"✅ Dataset başarıyla indirildi ve şuraya çıkarıldı: {target_dir}")
        
        # Cleanup if any zip left
        for item in target_dir.glob("*.zip"):
            item.unlink()
            
    except Exception as e:
        print(f"❌ İndirme sırasında hata oluştu: {e}")
        print("\nİpucu: kaggle.json dosyanızın doğru yerde olduğundan emin olun.")

if __name__ == "__main__":
    download_kaggle_dataset()
