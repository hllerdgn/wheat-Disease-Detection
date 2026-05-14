import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';
import { useState, useRef, DragEvent } from 'react';
import { motion } from 'motion/react';

interface EnhancedUploadAreaProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function EnhancedUploadArea({
  onImageSelect,
  selectedImage,
  onClear,
  disabled,
}: EnhancedUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      if (files[0].size > 10 * 1024 * 1024) {
        alert('⚠️ Dosya boyutu 10MB\'dan büyük olamaz!');
        return;
      }
      onImageSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].size > 10 * 1024 * 1024) {
        alert('⚠️ Dosya boyutu 10MB\'dan büyük olamaz!');
        return;
      }
      onImageSelect(files[0]);
    }
  };

  const handleFileClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleCameraClick = () => {
    if (!disabled) {
      cameraInputRef.current?.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="w-full max-w-3xl mx-auto px-6"
      id="upload-section"
    >
      {!selectedImage ? (
        <div className="space-y-6">
          <div
            onClick={handleFileClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative group cursor-pointer
              rounded-3xl border-4 border-dashed p-16
              transition-all duration-300 ease-out
              ${
                isDragging
                  ? 'border-[#20A85B] bg-emerald-50/70 scale-[1.02] shadow-2xl shadow-emerald-500/30'
                  : 'border-gray-300 hover:border-[#3CCB7F] hover:bg-gray-50/50 shadow-xl'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{
              background: isDragging
                ? 'linear-gradient(135deg, rgba(32, 168, 91, 0.1) 0%, rgba(60, 203, 127, 0.1) 100%)'
                : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              disabled={disabled}
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              className="hidden"
              disabled={disabled}
            />

            <div className="flex flex-col items-center gap-6">
              <div
                className={`
                p-8 rounded-full transition-all duration-300 shadow-xl
                ${
                  isDragging
                    ? 'bg-gradient-to-br from-[#20A85B] to-[#1B7A4E] scale-110'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-[#20A85B] group-hover:to-[#1B7A4E] group-hover:scale-110'
                }
              `}
              >
                <Upload
                  className={`
                  w-16 h-16 transition-all duration-300
                  ${isDragging ? 'text-white' : 'text-gray-600 group-hover:text-white'}
                `}
                />
              </div>

              <div className="text-center space-y-4">
                <h3
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {isDragging ? '🎯 Fotoğrafı Bırakın!' : '📸 Buğday Yaprakının Fotoğrafını Yükleyin'}
                </h3>
                <p
                  className="text-base text-gray-600 font-medium"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Sürükleyin ve bırakın veya tıklayarak dosya seçin
                </p>

                <div className="flex flex-wrap gap-3 justify-center pt-4">
                  <div className="px-4 py-2 bg-white rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">PNG, JPG, JPEG</p>
                  </div>
                  <div className="px-4 py-2 bg-white rounded-xl shadow-md border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">Maksimum 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Camera button for mobile */}
          <div className="flex justify-center">
            <button
              onClick={handleCameraClick}
              disabled={disabled}
              className="px-6 py-3 bg-white border-2 border-[#20A85B] text-[#20A85B] font-semibold rounded-xl hover:bg-[#20A85B] hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <Camera className="w-5 h-5" />
              <span>Kameradan Fotoğraf Çek</span>
            </button>
          </div>

          {/* Helpful tip */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p
              className="text-sm text-blue-800 text-center"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              💡 <strong>İpucu:</strong> Açık ışıkta çekilmiş, net bir fotoğraf en iyi sonuçları
              verir.
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl overflow-hidden bg-white shadow-2xl border-2 border-gray-200"
        >
          <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
            {selectedImage.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <ImageIcon className="w-24 h-24 text-gray-300" />
            )}
          </div>

          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[#20A85B] to-[#1B7A4E] rounded-xl shadow-lg">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p
                  className="font-bold text-gray-800 truncate max-w-md"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {selectedImage.name}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {(selectedImage.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>

            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="p-3 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
