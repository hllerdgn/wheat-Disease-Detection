# 🌾 Wheat Disease Detection - Simple Frontend

Modern, şık ve profesyonel bir buğday hastalık tespiti web uygulaması.

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── SimpleApp.tsx                    # Ana uygulama
│   └── components/
│       └── simple/
│           ├── SimpleHero.tsx           # Hero bölümü (Logo + Slogan)
│           ├── UploadZone.tsx           # Drag & Drop yükleme alanı
│           ├── LoadingSpinner.tsx       # Yükleme animasyonu
│           └── ResultsPanel.tsx         # Sonuç gösterimi
├── main.tsx                             # Entry point
└── index.css                            # Tailwind imports
```

## 🎨 Özellikler

### ✨ Tasarım
- **Modern UI**: Glassmorphism efektleri, soft shadows
- **Emerald Green**: Doğa ve teknoloji teması
- **Responsive**: Mobil ve desktop uyumlu
- **Animasyonlar**: Framer Motion ile smooth transitions

### 🚀 Fonksiyonellik
- **Drag & Drop**: Fotoğraf sürükle-bırak
- **Image Preview**: Seçilen fotoğraf önizlemesi
- **API Integration**: FastAPI backend entegrasyonu
- **Loading States**: Şık spinner ve skeleton screens
- **Error Handling**: Toast notifications ile hata yönetimi
- **Demo Mode**: Backend yoksa mock data ile çalışır

## 🔌 API Entegrasyonu

### Endpoint
```
POST http://localhost:8000/analyze
Content-Type: multipart/form-data
```

### Request
```typescript
FormData {
  file: File // Buğday yaprak fotoğrafı
}
```

### Response
```typescript
{
  "classification": {
    "predicted_class": "Yellow Rust",
    "confidence": 0.9821,
    "is_certain": true,
    "top3_predictions": [
      { "class": "Yellow Rust", "score": 0.9821 },
      { "class": "Brown Rust", "score": 0.0125 },
      { "class": "Healthy", "score": 0.0054 }
    ]
  },
  "quality": {
    "is_valid": true,
    "blur_score": 145.6,
    "warnings": []
  },
  "meta": {
    "processing_time_ms": 125.4
  }
}
```

## 🎯 Kullanım

1. **Backend'i Başlat** (FastAPI):
   ```bash
   # Backend klasöründe
   uvicorn main:app --reload --port 8000
   ```

2. **Frontend'i Başlat**:
   ```bash
   # Bu klasörde
   pnpm install
   pnpm dev
   ```

3. **Tarayıcıda Aç**:
   - URL: http://localhost:5173 (veya Vite'in verdiği port)

## 🔧 Teknoloji Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Radix UI** - Progress Bars
- **Sonner** - Toast Notifications

## 📸 Kullanıcı Akışı

1. **Fotoğraf Yükle**: Drag & drop veya tıklayarak seç
2. **Preview**: Seçilen fotoğrafı gör
3. **Analiz Et**: "Görüntüyü Analiz Et" butonuna tık
4. **Loading**: Şık spinner ile bekle (2-3 saniye)
5. **Sonuç**: Hastalık, güven skoru ve alternatifler görüntülenir
6. **Yeni Analiz**: "Yeni Analiz Yap" ile başa dön

## 🎨 Renk Paleti

```css
/* Primary */
Emerald-500: #10b981
Emerald-600: #059669

/* Disease Colors */
Healthy: Emerald (Green)
Rust: Orange
Other: Red

/* Neutrals */
Gray-50: #f9fafb
Gray-100: #f3f4f6
White: #ffffff
```

## 🚨 Hata Yönetimi

- **API Down**: Mock data ile demo mode
- **Invalid File**: Toast error notification
- **Low Quality**: Warning mesajı göster
- **Network Error**: User-friendly error message

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (Single column)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (Grid layout)

## 🔐 Gizlilik

Fotoğraflar sadece analiz için kullanılır ve işlem sonrası otomatik silinir.

---

**Geliştirici**: WheatGuard AI Team
**Version**: 1.0.0
**License**: MIT
