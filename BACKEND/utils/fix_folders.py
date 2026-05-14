import os

def fix_folder_names(data_dir):
    """
    valid ve test klasörlerindeki sınıf isimlerini train klasöründeki ile aynı yapar.
    Örn: 'smut_valid' -> 'Smut'
    """
    train_dir = os.path.join(data_dir, 'train')
    valid_dir = os.path.join(data_dir, 'valid')
    test_dir = os.path.join(data_dir, 'test')
    
    # Train klasöründen hedeflenen isimleri çekelim
    # Örn: 'Smut', 'Stem fly', vs.
    target_names = [d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))]
    
    # İsimleri küçük harf ve boşluksuz/alt çizgili yapıya getirme haritası
    # Örn: 'Smut' -> 'smut', 'Yellow Rust' -> 'yellow_rust'
    name_map = {}
    for name in target_names:
        normalized = name.lower().replace(" ", "_").replace("-", "_")
        name_map[normalized] = name

    # valid için düzeltme
    for subdir in os.listdir(valid_dir):
        old_path = os.path.join(valid_dir, subdir)
        if os.path.isdir(old_path):
            # 'smut_valid' -> 'smut' bul
            base_name = subdir.replace("_valid", "").replace("_val", "").lower()
            if base_name in name_map:
                new_path = os.path.join(valid_dir, name_map[base_name])
                if not os.path.exists(new_path):
                    os.rename(old_path, new_path)
                    print(f"Renamed: {old_path} -> {new_path}")
                else:
                    print(f"Bypass (already exists): {new_path}")
            else:
                print(f"[UYARI] Eşleşme bulunamadı: {subdir}")

    # test için düzeltme
    for subdir in os.listdir(test_dir):
        old_path = os.path.join(test_dir, subdir)
        if os.path.isdir(old_path):
            base_name = subdir.replace("_test", "").lower()
            if base_name in name_map:
                new_path = os.path.join(test_dir, name_map[base_name])
                if not os.path.exists(new_path):
                    os.rename(old_path, new_path)
                    print(f"Renamed: {old_path} -> {new_path}")
                else:
                    print(f"Bypass (already exists): {new_path}")
            else:
                print(f"[UYARI] Eşleşme bulunamadı: {subdir}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    data_path = os.path.join(project_root, "data")
    fix_folder_names(data_path)
