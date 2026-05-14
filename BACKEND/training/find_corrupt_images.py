import os
from glob import glob
from PIL import Image

def find_corrupt_images(data_dir):
    print(f"Veri dizini aranıyor: {os.path.abspath(data_dir)}")
    image_files = glob(os.path.join(data_dir, '**', '*.jpg'), recursive=True) + \
                  glob(os.path.join(data_dir, '**', '*.jpeg'), recursive=True) + \
                  glob(os.path.join(data_dir, '**', '*.png'), recursive=True)
    
    print(f"Toplam {len(image_files)} resim bulundu. Taranıyor...")
    
    corrupt_images = []
    
    for i, file_path in enumerate(image_files):
        if i % 1000 == 0 and i > 0:
            print(f"{i} resim tarandı...")
            
        try:
            with Image.open(file_path) as img:
                # verify() sadece dosyanın bir resim olduğunu doğrular
                img.verify()
            
            # verify() kapatıp açmayı gerektirdiği için yeniden açıyoruz
            # load() veriyi belleğe alır, bozuk byte kısımlarını burada yakalarız
            with Image.open(file_path) as img:
                img.load()
                
        except Exception as e:
            print(f"Bozuk dosya bulundu: {file_path} - Hata: {str(e)}")
            corrupt_images.append((file_path, str(e)))
            
    print("-" * 50)
    print(f"Tarama bitti. Toplam {len(corrupt_images)} adet bozuk resim bulundu.")
    for file, err in corrupt_images:
        print(f"> {file}")
        
    return corrupt_images

if __name__ == "__main__":
    find_corrupt_images("../data")
