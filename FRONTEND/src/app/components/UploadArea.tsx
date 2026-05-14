import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, DragEvent } from 'react';
import { motion } from 'motion/react';

interface UploadAreaProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export function UploadArea({ onImageSelect, selectedImage, onClear, disabled }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onImageSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="w-full max-w-2xl mx-auto px-6"
    >
      {!selectedImage ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative group cursor-pointer
            rounded-3xl border-2 border-dashed p-12
            transition-all duration-300 ease-out
            ${isDragging
              ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02] shadow-2xl shadow-emerald-500/20 -translate-y-1'
              : 'border-white/50 hover:border-emerald-400/60 hover:-translate-y-1 shadow-2xl hover:shadow-emerald-500/10'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            background: isDragging
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(251, 191, 36, 0.08) 100%)'
              : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(16px)',
            borderColor: isDragging ? '#10b981' : 'rgba(255, 255, 255, 0.5)',
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

          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-7 rounded-full transition-all duration-300 shadow-lg
              ${isDragging
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 scale-110'
                : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:scale-110'
              }
            `}>
              <Upload className={`
                w-14 h-14 transition-all duration-300
                ${isDragging ? 'text-white' : 'text-gray-500 group-hover:text-white'}
              `} />
            </div>

            <div className="text-center space-y-3">
              <p className="text-2xl font-bold text-gray-800">
                {isDragging ? '🎯 Bırakın!' : 'Fotoğraf Yükleyin'}
              </p>
              <p className="text-base text-gray-600 font-medium">
                Sürükle-bırak yapın veya tıklayarak seçin
              </p>
              <div className="pt-3 flex items-center justify-center gap-2">
                <div className="px-3 py-1 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold">
                    PNG, JPG, JPEG
                  </p>
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold">
                    Maks. 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/0 via-transparent to-amber-500/0 group-hover:from-emerald-500/10 group-hover:to-amber-500/10 transition-all duration-500 pointer-events-none"></div>

          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(251, 191, 36, 0.1))',
            }}
          ></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md shadow-2xl border border-white/50"
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

            {/* Glassmorphic overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-5 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 truncate max-w-xs">
                  {selectedImage.name}
                </p>
                <p className="text-xs text-gray-600 font-medium">
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
                className="p-2.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
