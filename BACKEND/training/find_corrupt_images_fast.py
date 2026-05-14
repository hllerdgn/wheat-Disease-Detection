import os
from glob import glob
from PIL import Image
from concurrent.futures import ProcessPoolExecutor

def check_image(file_path):
    try:
        with Image.open(file_path) as img:
            img.verify()
        with Image.open(file_path) as img:
            img.load()
        return None
    except Exception as e:
        return (file_path, str(e))

def find_corrupt_images(data_dir):
    print(f"Hızlı tarama başlatılıyor: {os.path.abspath(data_dir)}")
    image_files = glob(os.path.join(data_dir, '**', '*.jpg'), recursive=True) + \
                  glob(os.path.join(data_dir, '**', '*.jpeg'), recursive=True) + \
                  glob(os.path.join(data_dir, '**', '*.png'), recursive=True)
    
    print(f"Toplam {len(image_files)} resim taramaya alınıyor...")
    
    corrupt_images = []
    with ProcessPoolExecutor() as executor:
        results = executor.map(check_image, image_files)
        
        for i, res in enumerate(results):
            if i % 2000 == 0 and i > 0:
                print(f"{i} resim tarandı...")
            if res is not None:
                print(f"Bozuk dosya bulundu: {res[0]} - Hata: {res[1]}")
                corrupt_images.append(res)
                
    print("-" * 50)
    print(f"Tarama bitti. Toplam {len(corrupt_images)} adet bozuk resim bulundu.")
    for file, err in corrupt_images:
        print(f"> {file}")
        
    return corrupt_images

if __name__ == "__main__":
    find_corrupt_images("../data")
