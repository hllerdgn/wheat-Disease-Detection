import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function UploadZone({ onFileSelect, selectedFile, onClear, isAnalyzing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!isAnalyzing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative cursor-pointer
              border-4 border-dashed rounded-3xl p-16
              transition-all duration-300
              ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 scale-105'
                  : 'border-gray-300 hover:border-emerald-400 bg-white/60'
              }
              backdrop-blur-sm shadow-lg hover:shadow-xl
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-6">
              <div
                className={`
                  p-6 rounded-full transition-all duration-300
                  ${
                    isDragging
                      ? 'bg-emerald-500 scale-110'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-emerald-500 hover:to-emerald-600 hover:scale-110'
                  }
                `}
              >
                <Upload
                  className={`w-16 h-16 transition-colors ${isDragging ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}
                />
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">
                  {isDragging ? '📸 Bırakın!' : 'Fotoğraf Yükleyin'}
                </h3>
                <p className="text-gray-600">
                  Buğday yaprak fotoğrafınızı sürükleyin veya tıklayarak seçin
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG - Maksimum 10MB</p>
              </div>
            </div>

            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl overflow-hidden bg-white shadow-2xl"
          >
            <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-full object-contain"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="p-6 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 truncate max-w-sm">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              {!isAnalyzing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="p-3 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
