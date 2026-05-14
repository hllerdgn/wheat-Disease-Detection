# 🌾 BUĞDAY HASTALIK TEŞHİS PLATFORMU - KAPSAMLI WEB SITE PROMPTU

## 📋 PROJE ÖZETI

Bu, tarım teknolojisinin ön safında duran, yapay zeka destekli bir buğday hastalığı teşhis platformudur. Platform, çiftçilerin ve tarım mühendislerinin buğday bitkilerinin sağlığını hızlı, doğru ve güvenilir bir şekilde kontrol etmesini sağlar.

---

## 🎨 TASARIM FELSEFESİ

**Estetik Yönelim:** "Organik Teknoloji + Profesyonel Güvenilirlik"
- Doğanın yeşillikleri ile teknolojinin gücünü birleştir
- Tarım sektörünün geleneksel yapısı ile modern AI'ın birleşimi
- Profesyonel ama erişilebilir, teknik ama kullanıcı dostu
- Güven ve hız dengesesi

**Ruh Hali:** Sakin, güvenilir, ümitvar, modern

---

## 🌾 ARKA PLAN VE GÖRSEL TEMASI

### ANA ARKA PLAN:
```
1. HERO/HEADER BÖLÜMÜ:
   - Fotoğraf: Açık ışıkta sarı-yeşil buğday tarlası (çiftçi perspektifinden)
   - Overlay: Yarı şeffaf gradient (koyu yeşil → transparent)
   - Eğim: Hafif diagonal, 15° açı (dinamiklik)
   - Renk: Yeşil (#1B7A4E) + Altın (#D4AF37) tınıları
   - Particle Effect: Hafif rüzgarda savrulan buğday taneleri (CSS animasyon)
   
2. ORTA SEKSİYONLAR:
   - Arka plan: Yumuşak gradient (#F8FCF7 → #FFFFFF)
   - Alt pattern: Çok ince çiftçi buğday görseli (opacity: 0.03)
   - Doku: Hafif linen/kumaş texture overlay
   
3. FOOTER/ALT:
   - Arka plan: Koyu yeşil (#1B7A4E)
   - Görsel: Tarla silüeti (horizon line)
   - Parçacıklar: Dönen yıldızlar, gece gökyüzü (tarımın doğası)
```

---

## 📱 SAYFA YAPISI

### 1️⃣ HEADER / NAVİGASYON

```html
┌────────────────────────────────────────────────────────────────┐
│ 🌾 WheatGuard AI          [HOME] [NASIL] [HASTALIKLAR] [HAKKIMIZ] │
│ (Logo + Platform Adı)                              [GİRİŞ]      │
└────────────────────────────────────────────────────────────────┘

ÖZELLİKLER:
✓ Sticky nav (kaydırınca yapışan)
✓ Logo sol tarafta (buğday başağı + AI günsüş ikonu)
✓ Menü orta: Home, Nasıl Çalışır, Hastalık Veritabanı, Hakkında
✓ Sağ taraf: Dil seçimi (TR/EN), Giriş/Kayıt, Koyu mod toggle
✓ Mobilde hamburger menu
```

---

### 2️⃣ HERO BÖLÜMÜ (İlk Etki)

```
┌─────────────────────────────────────────────────────────────────┐
│                    [BUĞDAY TARLASI ARKA PLAN]                   │
│          (Açık ışıkta sarı-yeşil yapraklar, rüzgarda dalgası)  │
│                                                                  │
│   ┌────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │  🌾 BUĞDAY SAĞLIĞI, AI İLE KORUNUN                    │   │
│   │                                                         │   │
│   │  Tarımınızı tehdit eden hastalıkları saniye içinde     │   │
│   │  tespit edin. EfficientNet-B3 teknolojisi, %96        │   │
│   │  doğruluk oranı, 15 farklı hastalık tanısı.           │   │
│   │                                                         │   │
│   │  ⭐ 25,000+ analiz | 📊 98.9% memnuniyet | 🏆 Türk AI │   │
│   │                                                         │   │
│   │         [🚀 HEMEN BAŞLA] [📺 NASIL ÇALIŞIR]          │   │
│   │                                                         │   │
│   └────────────────────────────────────────────────────────┘   │
│                                                                  │
│                [Şeffaf overlay + gradient gölge]                │
└─────────────────────────────────────────────────────────────────┘

ÖZELLİKLER:
✓ Arka plan: Buğday tarlası fotoğrafı (blur: 5px, brightness: 0.8)
✓ Metin: Beyaz, kalın, 36px (desktop) / 24px (mobile)
✓ Overlay: Koyu yeşil gradient, 0.6 opacity, diagonal
✓ İstatistikler: Pulkası animasyonlu gelen kutular
✓ Butonlar: Yeşil (#20A85B) + Beyaz border, 18px, hover ile glow
✓ CTA: Pulsing animation (tempo: 1.5s), kurşun etkisi
```

---

### 3️⃣ FEATURE CARDS BÖLÜMÜ

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEDEN WHEATGUARD AI?                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │              │  │              │  │              │           │
│  │ 🔬 15        │  │ ⚡ ANINDA    │  │ 🎯 %96       │           │
│  │ HASTALIK     │  │ SONUÇ       │  │ DOĞRULUK     │           │
│  │              │  │              │  │              │           │
│  │ Fusarium,    │  │ 2-3 saniye   │  │ EfficientNet │           │
│  │ Septoria,    │  │ içinde       │  │ B3 AI Model │           │
│  │ Powdery Mildew   │ analiz      │  │              │           │
│  │ ve daha fazla│  │              │  │ Yapay zeka   │           │
│  │              │  │              │  │ destekli     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │              │  │              │  │              │           │
│  │ 🛡️ GÜVENLİK │  │ 💾 TARİHÇE   │  │ 📱 MOBİL    │           │
│  │ & GİZLİLİK  │  │ & RAPOR      │  │ UYUMLU      │           │
│  │              │  │              │  │              │           │
│  │ Verileriniz  │  │ Önceki       │  │ Cep          │           │
│  │ saklanmaz,   │  │ taramaları   │  │ telefondan   │           │
│  │ silinir      │  │ takip et     │  │ kullan       │           │
│  │              │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

ÖZELLİKLER:
✓ 6 Kart: 3×2 grid (desktop) / 2×3 (tablet) / 1×6 (mobile)
✓ Her Kart:
  - Beyaz arka plan, shadow (0 8px 24px rgba(0,0,0,0.08))
  - Hover: Yukarı kayma (transform: translateY(-8px))
  - Border-top: 4px yeşil (#20A85B)
  - İkon: 48px, emoji veya SVG, koyu yeşil renk
  - Başlık: 20px, Montserrat Bold, koyu gri
  - Açıklama: 14px, Open Sans, açık gri
  - Transition: 0.3s ease

✓ Arka plan: Yumuşak gradient (#F8FCF7 → #FFFFFF)
✓ Pattern: Çok hafif buğday silüeti (opacity: 0.02)
```

---

### 4️⃣ UPLOAD/ANALYSE BÖLÜMÜ (ANA İŞLEV)

```
┌─────────────────────────────────────────────────────────────────┐
│                   BUĞDAY FOTOĞRAFINI YÜKLE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ADIM 1: FOTOĞRAF SEÇ/SÜRÜKLE                                   │
│  ┌───────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │        📸                                             │     │
│  │   FOTOĞRAF SÜRÜKLEYİN                               │     │
│  │   veya tıklayarak dosya seçin                        │     │
│  │                                                       │     │
│  │  ✓ PNG, JPG, JPEG (Max 10MB)                         │     │
│  │  ✓ Açık ışıkta, net fotoğraf en iyi sonuç           │     │
│  │  ✓ Buğday yaprakını çerçeveye al                    │     │
│  │                                                       │     │
│  └───────────────────────────────────────────────────────┘     │
│        (Dashed border, yeşil, hover: pulse)                    │
│                                                                  │
│  ADIM 2: ÖN İZLEME & DOĞRULA                                    │
│  ┌──────────────────────────┐  [Seç]  [Analiz Et]      │     │
│  │                          │                           │     │
│  │  📷 Seçilen Fotoğraf    │  Dosya: leaf123.jpg       │     │
│  │  (Thumbnail 100x100px)  │  Boyut: 2.4 MB ✓          │     │
│  │                          │  Format: JPEG ✓            │     │
│  └──────────────────────────┘                           │     │
│                                                                  │
│  ADIM 3: ANALIZ SONUCU                                         │
│  (Dinamik olarak yüklendikçe göster)                           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  ✅ ANALİZ TAMAMLANDI                              │       │
│  │                                                      │       │
│  │  TEŞHIS: SEPTORIA LEAF BLOTCH                      │       │
│  │  Güven: ██████████░ 96.8%                          │       │
│  │                                                      │       │
│  │  ⚠️ RİSK SEVİYESİ: YÜKSEK                          │       │
│  │  Hızlı müdahale önerilir.                          │       │
│  │                                                      │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

ÖZELLİKLER:

UPLOAD ALANI:
✓ Büyük dashed border (#20A85B, 3px)
✓ Arka plan: Çok hafif yeşil (#F0F9F6)
✓ Hover: Border rengi yeşile döner, arka plan daha açılır
✓ Drag aktif: Opacity artır, scale: 1.02
✓ İkon: 64px emoji veya SVG
✓ Metin: Montserrat Bold, 18px, koyu gri + Açık gri yardımcı
✓ Padding: 60px

ÖN İZLEME BÖLÜMÜ:
✓ Thumbnail: 100×100px, border-radius: 8px, shadow
✓ Dosya bilgisi: 3 satır, 14px, Open Sans
✓ Buton stil: İkincil (border, yeşil metin)

SONUÇ KARTININ STİLİ:
✓ Arka plan: Hafif yeşil (#F0F9F6)
✓ Border: Solda 4px yeşil (#20A85B)
✓ İçinde 3 satır:
  1. Başlık + Check icon
  2. Hastalık adı + Risk göstergesi
  3. İstatistik bar

ANIMASYONLAR:
✓ Drag hover: Pulse effect (scale: 1.02, 1.5s)
✓ Analiz sırasında: Loading spinner (yeşil, dönüş)
✓ Sonuç yüklenince: Fade-in + slide-up (300ms)
```

---

### 5️⃣ DETAYLI SONUÇ EKRANI

```
┌─────────────────────────────────────────────────────────────────┐
│                  📊 DETAYLI ANALİZ RAPORU                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Yüklenen Fotoğraf]  │  TEŞHIS SONUCU                         │
│  ┌──────────────┐     │  ┌────────────────────────────┐        │
│  │              │     │  │ 🔴 SEPTORIA LEAF BLOTCH   │        │
│  │  📷 Yaprak   │     │  │                            │        │
│  │  Fotoğrafı   │     │  │ Bilimsel: Zymoseptoria    │        │
│  │              │     │  │ Türkçe: Septorya Yaprak   │        │
│  │  (300×300px) │     │  │                            │        │
│  │              │     │  │ Güven: ███████████░ 96.8% │        │
│  └──────────────┘     │  │                            │        │
│  Tarih: 30/04/2026    │  │ 🔴 RİSK: YÜKSEK           │        │
│  Saat: 14:32 UTC      │  │                            │        │
│                       │  └────────────────────────────┘        │
│                       │                                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 📋 HASTALLIK BİLGİSİ                                            │
│ ────────────────────────────────────────────────────────────    │
│                                                                  │
│ 📌 BELİRTİLER:                                                 │
│    • Yaprakta gri-kahve renkli lekeler                          │
│    • Lekelerin merkezinde siyah nokta (piknidium)              │
│    • İleri aşamada yaprak sarısı ve ölümü                      │
│    • Nem koşullarında hızlı yayılım                            │
│                                                                  │
│ 🦠 PATOJEN BİLGİSİ:                                            │
│    • Fungal hastalık (Zymoseptoria tritici)                    │
│    • Rüzgar ve yağmurla yayılır                                │
│    • Optimal sıcaklık: 15-20°C                                 │
│    • Optimal nem: %80+ nispi nem                               │
│                                                                  │
│ 💊 BÜTÜNLEŞIK YÖNETİM STRATEJİSİ:                              │
│                                                                  │
│    HEMEN YAPILMASI GEREKENLER:                                 │
│    ✓ Fungisit uygulaması (YAŞAM ORTASI):                      │
│      • Mancozeb (800g/da) - Temel fungisit                    │
│      • Azoxystrobin (30g/da) - Koruyucu ve tedavi edici       │
│      • Karben (300g/da) - Alternatif seçenek                 │
│                                                                  │
│    ✓ Püskürtme Zamanı:                                        │
│      • İlk belirtilerde hemen başla                           │
│      • 10-14 gün ara ile 2-3 defa tekrarla                    │
│      • Son püskürtmeyi hasat 14 gün öncesinde bitir           │
│                                                                  │
│    ✓ Pratik İşlemler:                                         │
│      • Enfekte yaprakları manuel olarak çıkar                 │
│      • Tartı ve makineleri dezenfekte et                      │
│      • Yoğun sulama yapmaktan kaçın (nem ↑)                   │
│      • Hava sirkülasyonunu iyileştir                          │
│                                                                  │
│ 🛡️ UZUN DÖNEM ÖNLEME:                                         │
│    • Hastalık dirençli çeşit seç (R geni taşıyanlar)         │
│    • Bitki kalıntılarını toprağa karıştır/yak                 │
│    • Ekim dönemini uygun zamanla (kasım sonu)                 │
│    • 3+ yıl ekim rotasyonu uygula                             │
│    • Alet dezenfeksiyon (5% H2O2 veya 1% KOH)                │
│                                                                  │
│ 📞 UZMAN TAVSİYESİ:                                            │
│    Hastalık sağlık tehlikesi oluşturuyorsa, tarım             │
│    mühendisine danışmanız önerilir.                            │
│    [Tarım Danışmanı Bul] [Ülkenize Yakın Uzmanlar]           │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [🔄 YENİ FOTOĞRAF YÜKLE]  [📥 PDF RAPOR İNDİR]               │
│ [📧 MAİL GÖNDER]  [📱 SOSYAL PAYLAŞ]  [💾 TARİHÇEYE KAY]    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

ÖZELLİKLER:

LAYOUT:
✓ Desktop: 2 sütun (sol fotoğraf, sağ sonuç) / Mobil: Full stack
✓ Fotoğraf: 300×300px, border-radius: 12px, shadow: 0 12px 32px
✓ Sonuç kartı: Beyaz arka plan, border-left: 6px risk rengi

RENK KODLAMASI (RİSK SEVİYESİ):
✓ DÜŞÜK: Yeşil (#27AE60)
✓ ORTA: Sarı (#F39C12)
✓ YÜKSEK: Kırmızı (#E74C3C)

TYPOGRAPHY:
✓ Başlık: 24px, Montserrat Bold, koyu gri
✓ Alt başlık: 16px, Montserrat SemiBold, yeşil
✓ Gövde: 14px, Open Sans, koyu gri (#333)
✓ Yardımcı: 13px, Open Sans, açık gri (#777)

BÖLÜMLENDİRME:
✓ Başlık + İstatistik (renk kutusu)
✓ Belirtiler (madde işaretli liste, ikon)
✓ Patojen bilgisi (teknik info)
✓ Yönetim stratejisi (renkli alt başlıklar)
✓ Butonlar (3 renk seçeneği: Birincil, İkincil, Danger)

SCROLL DEĞİŞKENLİĞİ:
✓ Başlık yapışkın (sticky: top 60px)
✓ Butonlar sonunda fixed (mobile için)
```

---

### 6️⃣ HASTALLIK VERITABANI / KAÇ SAYFASI

```
┌─────────────────────────────────────────────────────────────────┐
│               🗂️ HASTALLIK VERITABANI                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Ara:  [________________] [🔍]     Kategori: [Tümü ▼]          │
│                                                                  │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐      │
│  │ 1️⃣ SEPTORIA   │ │ 2️⃣ FUSARIUM   │ │ 3️⃣ POWDERY    │      │
│  │                │ │                │ │ MILDEW         │      │
│  │ Riski: YÜKSEK  │ │ Riski: ORTA    │ │ Riski: ORTA    │      │
│  │                │ │                │ │                │      │
│  │ Zymoseptoria   │ │ Fusarium spp   │ │ Blumeria       │      │
│  │ tritici        │ │                │ │ graminis       │      │
│  │                │ │                │ │                │      │
│  │ [DETAY]        │ │ [DETAY]        │ │ [DETAY]        │      │
│  └────────────────┘ └────────────────┘ └────────────────┘      │
│                                                                  │
│  (Daha fazla hastalık için aşağı kaydır)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

ÖZELLİKLER:
✓ 15 hastalığın her biri kart olarak
✓ Kart rengi: Risk seviyesine göre (yeşil/sarı/kırmızı sol border)
✓ Grid: 3 sütun (desktop) / 2 (tablet) / 1 (mobile)
✓ Arama: Real-time filtreleme
✓ Tıklama: Modal açılır, detaylar gösterilir
```

---

### 7️⃣ SONUÇ TARİHÇESİ / DASHBOARD

```
┌─────────────────────────────────────────────────────────────────┐
│                  📊 TARAMA TARİHÇESİ                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SON 10 TARAMA:                                                 │
│                                                                  │
│  1. [30 Nisan] Septoria Leaf Blotch - 96.8% ⚠️ YÜKSEK          │
│  2. [28 Nisan] Healthy Wheat - 99.2% ✅ NORMAL                 │
│  3. [25 Nisan] Fusarium Head Blight - 92.1% ⚠️ ORTA            │
│  4. [20 Nisan] Powdery Mildew - 88.5% ⚠️ ORTA                  │
│  5. [15 Nisan] Healthy Wheat - 99.5% ✅ NORMAL                 │
│  ...                                                            │
│                                                                  │
│  [PDF RAPOR OLUŞTUR] [CSV DIŞA AKTAR] [SİL]                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8️⃣ FOOTER BÖLÜMÜ

```
┌─────────────────────────────────────────────────────────────────┐
│                  🌾 FOOTER (KOYU YEŞIL ARKA PLAN)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ABOUT US              USEFUL LINKS      LEGAL                  │
│  • Hakkında            • Hastalıklar     • Gizlilik Politikası  │
│  • Ekip                • Blog            • Kullanım Şartları    │
│  • İletişim            • Rehber          • İletişim             │
│                        • SSS             • Tercihler            │
│                                                                  │
│  SOSYAL:              BIZE ULAŞIN:                              │
│  Twitter • Facebook   info@wheatguard.ai                        │
│  LinkedIn • Instagram +90 XXX XXX XXXX                          │
│                       www.wheatguard.ai                         │
│                                                                  │
│  🔐 Gizlilik: Fotoğraflarınız analiz sonrası silinir.          │
│  © 2026 WheatGuard AI. Tüm hakları saklıdır.                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

ÖZELLİKLER:
✓ Arka plan: #1B7A4E (koyu yeşil)
✓ Metin: Beyaz (#FFFFFF)
✓ Grid: 4 sütun (desktop) / 2 (tablet) / 1 (mobile)
✓ Tarla silüeti SVG (bottom, opacity: 0.1)
✓ Padding: 60px top-bottom
```

---

## 🎨 RENK PALETİ

```
PRIMARY (Birincil):
  • Koyu Yeşil:     #1B7A4E (başlıklar, header, footer)
  • Orta Yeşil:     #20A85B (butonlar, CTA, highlight)
  • Açık Yeşil:     #3CCB7F (hover, accent)
  • Çok Açık Yeşil: #E8F5F0 (arka plan, subtle)

SECONDARY (İkincil):
  • Altın:          #D4AF37 (vurgu, premium)
  • Kahve:          #8B7355 (çiftçi teması)

NEUTRALS (Nötr):
  • Beyaz:          #FFFFFF (arka plan)
  • Gri-1:          #F5F5F5 (ikincil arka plan)
  • Gri-2:          #D1D5DB (bordeler, divider)
  • Gri-3:          #888888 (placeholder, hint)
  • Koyu Gri:       #333333 (ana metin)

STATUS (Durum):
  • Başarı Yeşil:   #27AE60 (normal, başarı)
  • Uyarı Sarısı:   #F39C12 (orta risk)
  • Hata Kırmızısı: #E74C3C (yüksek risk)
  • Info Mavi:      #3498DB (bilgilendirme)

DARK MODE:
  • Arka Plan:      #1a1a2e (très koyu gri)
  • Metin:          #E0E0E0
  • Kart:           #16213e
```

---

## 🔤 TİPOGRAFİ SYSTEMI

```
DISPLAY FONT (Başlıklar, Vurgu):
  • Font Family: "Montserrat", "Poppins" (sans-serif, bold)
  • Bölünme:
    - h1: 48px (desktop) / 32px (mobile), weight: 800, spacing: -1px
    - h2: 36px / 28px, weight: 700
    - h3: 24px / 20px, weight: 600
    - h4: 20px / 18px, weight: 600

BODY FONT (Gövde Metin):
  • Font Family: "Open Sans", "Inter" (sans-serif, regular)
  • Bölünme:
    - p: 16px (desktop) / 14px (mobile), weight: 400, line-height: 1.6
    - small: 13px / 12px, weight: 400
    - strong: weight: 600 (bold)
    - em: font-style: italic

LINE-HEIGHT (Satır Yüksekliği):
  • Başlıklar: 1.2
  • Gövde Metin: 1.6
  • Kompakt: 1.4

LETTER-SPACING (Harf Aralığı):
  • Başlıklar: -0.5px (yakın)
  • Gövde: 0px (normal)
  • Küçük: 0.5px (açık)

FONT STACK:
  Sans-serif: "'Montserrat', 'Poppins', 'Segoe UI', 'Roboto', sans-serif"
  Alternative: "'Open Sans', 'Inter', 'Helvetica Neue', sans-serif"
```

---

## ✨ ANIMASYONLAR VE İNTERAKSİYONLAR

```
SAYFANIN YÜKLENME ANİMASYONU (Page Load):
✓ Header: Yukarıdan aşağıya slide (300ms, ease-out)
✓ Hero: Fade-in + parallax (500ms, ease-out)
✓ Kartlar: Aşamalı fade-in (delay: 100ms × index)
✓ Butonlar: Scale 0.8 → 1 (400ms, ease-out)

HOVER ETKİLERİ:
✓ Butonlar: 
  - Scale: 1.05
  - Shadow: 0 8px 24px (risk rengi)
  - Transition: 0.2s ease
✓ Kartlar:
  - TranslateY: -8px
  - Shadow artar
  - Transition: 0.3s ease
✓ Linkler:
  - Underline slide (bottom → top)
  - Color fade

DRAG-AND-DROP:
✓ Hover: Border pulsate (yeşil, 1.5s)
✓ Active: Scale 1.02, arka plan açılır
✓ File valid: Green border, checkmark animasyonu

LOADING (Analiz Sırasında):
✓ Spinner: Dönüş (1.5s, linear, infinite)
✓ Progress Bar: Width animate 0% → 100% (2-3s)
✓ Pulsing text: Opacity fade (1s, infinite)

SONUÇ GÖSTERME:
✓ Fade-in: 0 → 1 (300ms)
✓ Slide-up: translateY(20px) → 0 (300ms)
✓ Stagger: Her bölüm 100ms gecikmeli

SCROLL TRİGGER ANIMASYONLAR:
✓ Intersection Observer: Kart enter görüş alanı
✓ Fade-in + slide-up (300ms, ease-out)
✓ Counter animasyon (istatistikler) 0 → sayı (1s)

MİCRO-INTERACTIONS:
✓ Button click: Ripple effect (material design)
✓ Input focus: Border renk değişimi + glow
✓ Toast notification: Slide-in (sağ-bottom)
✓ Modal open: Backdrop fade, modal scale (200ms)
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
DESKTOP (1440px ve üstü):
  • Grid: 3 sütun
  • Font: Base size (16px)
  • Padding: 60px (horizontal)
  • Card width: calc(33.33% - 20px)

TABLET (768px - 1439px):
  • Grid: 2 sütun
  • Font: 15px
  • Padding: 40px
  • Card width: calc(50% - 15px)

MOBILE (320px - 767px):
  • Grid: 1 sütun
  • Font: 14px
  • Padding: 20px
  • Card width: 100%
  • Hamburger menu açılır
  • Butonlar tam genişlik

MOBİL-İLK (Mobile-First) STRATEJİSİ:
  • Base CSS: Mobile için yazıl
  • Media Query: min-width ile büyütülür
  • Touch targets: Min 48×48px
  • Hitbox: Min 24px padding
```

---

## ⚡ PERFORMANCE ÖZELLIKLERI

```
IMAGE OPTIMIZATION:
✓ WebP format (fallback: PNG/JPG)
✓ Responsive images (<img srcset="">)
✓ Lazy loading (loading="lazy")
✓ Arka plan görselleri: 5-10MB, blur processing
✓ Thumbnail: 2-5KB (WebP)

CODE SPLITTING:
✓ Main bundle: <100KB (gzip)
✓ Analiz ekranı: Lazy load
✓ Hastalık veritabanı: Dynamic import

FONT LOADING:
✓ Montserrat: 150KB (WOFF2)
✓ Open Sans: 120KB (WOFF2)
✓ Subset: Latin only
✓ Display: swap (FOUT avoid)

CACHING:
✓ Static assets: 1 yıl
✓ HTML: no-cache
✓ API responses: 5 dakika
✓ Service Worker: Offline modu

CORE WEB VITALS:
✓ LCP: < 2.5s (fotoğraf yüklü)
✓ FID: < 100ms (interaksiyon)
✓ CLS: < 0.1 (layout shift)
```

---

## 🔒 GÜVENLİK & GİZLİLİK

```
UYARILER:
✓ Hero'da prominent: "🔒 Gizlilik: Fotoğraflar sunucuda saklanmaz"
✓ Upload modal'da: "Verileriniz HTTPS ile şifrelenmiş"
✓ Footer'da: Gizlilik Politikası linki

VERİ YÖNETIMI:
✓ Analiz sonrası: Fotoğraf RAM'de silinir
✓ Metadata: EXIF verileri çıkarılır
✓ Backup yok: Production DB dışında
✓ Loglar: 30 gün saklı, PII yok

GDPR UYUMLU:
✓ Consent banner (ilk ziyaret)
✓ Çerez politikası
✓ Veri silme talep formu
✓ Veri taşıyabilirlik (JSON dışa aktarma)
```

---

## 📊 SEO & META INFORMATION

```
<title>Buğday Hastalık Teşhisi - AI Destekli | WheatGuard</title>
<meta name="description" content="
  EfficientNet-B3 AI ile buğday hastalıklarını %96 doğrulukta tespit edin. 
  15 farklı hastalık, anında sonuç, tarım önerileri. Ücretsiz başlayın.
">
<meta name="keywords" content="
  buğday hastalığı, teşhis, AI, yapay zeka, tarım teknolojisi, 
  septoria, fusarium, powdery mildew, tarım danışmanı
">
<meta name="robots" content="index, follow">
<meta name="og:title" content="Buğday Sağlığı, AI ile Korunun">
<meta name="og:description" content="Hastalık tespiti saniyeler içinde.">
<meta name="og:image" content="https://wheatguard.ai/og-image.png">
<meta name="og:type" content="website">

Structured Data (JSON-LD):
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "WheatGuard AI",
  "description": "Buğday hastalığı teşhis platformu",
  "url": "https://wheatguard.ai",
  "applicationCategory": "AgriculturalSoftware",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

---

## 🚀 TEKNIK STACK ÖNERISI

```
FRONTEND:
  • Framework: React 18 / Vue 3 (seçimse)
  • Styling: Tailwind CSS + CSS Modules
  • State: Redux / Pinia
  • Bundle: Vite (dev server)
  • UI Component: Headless UI / Radix UI

BACKEND:
  • Runtime: Node.js / Python (Django/FastAPI)
  • Database: PostgreSQL (metadata) + Redis (cache)
  • File Storage: AWS S3 / GCS
  • API: REST / GraphQL

AI/ML:
  • Model: TensorFlow / PyTorch EfficientNet-B3
  • Inference: ONNX Runtime (hız)
  • GPU: NVIDIA CUDA (optional)

DEPLOYMENT:
  • Hosting: Vercel / AWS / Heroku
  • Container: Docker
  • CI/CD: GitHub Actions / GitLab CI
  • Monitoring: Sentry, DataDog

SECURITY:
  • TLS 1.3 (HTTPS)
  • JWT Auth + Refresh tokens
  • Rate limiting (API)
  • Input validation (XSS, SQL injection)
```

---

## 📋 SAYFA HALİTASI (Sitemap)

```
/
├── / (Home)
├── /nasil-calisir (How it Works)
├── /hastaliklar (Disease Database)
│   ├── /hastaliklar/:id (Disease Detail)
├── /hakkinda (About)
├── /blog (Blog - Optional)
├── /iletisim (Contact)
├── /girisyap (Login)
├── /kayitol (Register)
├── /hesabim (My Account)
│   ├── /hesabim/tarama-tarihi (History)
│   ├── /hesabim/ayarlar (Settings)
├── /gizlilik-politikasi (Privacy Policy)
├── /kullanim-sartlari (Terms of Use)
```

---

## ✅ KONTROL LİSTESİ

```
□ Hero animasyonları
□ Drag-and-drop upload
□ Loading spinner
□ Sonuç ekranı detayları
□ Hastalık veritabanı
□ Responsive tasarım
□ Erişilebilirlik (WCAG 2.1 AA)
□ Dark mode
□ Dil seçimi (TR/EN)
□ Sosyal paylaşım
□ PDF raporlama
□ Email notifikasyonları
□ Hata handling
□ Empty states
□ 404 sayfası
□ Loading skeletons
□ Toast notifications
□ Modal dialogs
□ Konfirmasy dialogs
□ SEO optimizasyonu
□ Performance tuning
□ Analytics integration
□ A/B testing hooks
```

---

## 🎯 KULLANICI YOLCULUĞU (User Journey)

```
1. KEŞIF: Ziyaretçi siteni ziyaret eder
   → Hero'da ilgi çekici başlık, görseller
   → Feature kartları güven oluşturur
   → CTA "HEMEN BAŞLA" butonuna tıklar

2. HAZIRLIK: Fotoğraf seçme
   → Upload alanını göz atır
   → Örnek fotoğrafları inceler (isteğe bağlı)
   → Fotoğraf sürükler/seçer

3. ANALİZ: Sistem çalışıyor
   → Loading animasyonu izler
   → İlerleme bar gösterilir
   → Sabırla bekler

4. SONUÇ: Hastalık tanısı alır
   → Hastalık adı, risk seviyesi anında görülür
   → Detaylı bilgi kaydırarak okur
   → Tedavi önerileri uygulanabilir

5. AKSYON: Talimat alır ve hareket eder
   → PDF raporu indir
   → Tarım danışmanına email gönder
   → Sosyal ağlarda paylaş

6. TEKRAR: Başka fotoğraf yükler
   → "Yeni Fotoğraf Yükle" butonuna tıklar
   → Döngü tekrarlanır
```

---

---

## 🎬 SON NOTLAR

Bu prompt, tam bir profesyonel, ölçeklenebilir buğday hastalığı teşhis platformu için tasarlanmıştır. Organik doğa teması ile modern AI teknolojisinin birleşimi, tarım sektöründeki kullanıcılara güven ve hız sunmaktadır.

**Tasarımın Ruhu:** Yeşil enerji + Profesyonel güvenilirlik + Teknoloji gücü + Tarımsal pratiklik

Başarılar! 🌾✨