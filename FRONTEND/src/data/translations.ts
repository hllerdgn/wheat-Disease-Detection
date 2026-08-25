export type Language = "tr" | "en";

export interface TranslationDict {
  // Navigation & Header
  navDetection: string;
  navHowItWorks: string;
  navDiseases: string;
  navAbout: string;
  btnAnalyzeImage: string;
  statusOnline: string;
  statusOffline: string;
  statusConnecting: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroTitle2: string;
  heroDesc: string;
  heroBtnStart: string;
  heroBtnDiseases: string;
  heroStatAccuracy: string;
  heroStatAccuracyDesc: string;
  heroStatDiseases: string;
  heroStatDiseasesDesc: string;
  heroStatLatency: string;
  heroStatLatencyDesc: string;

  // Detection Section
  secDetectionBadge: string;
  secDetectionTitle: string;
  secDetectionDesc: string;

  // Uploader
  uploadTitle: string;
  uploadSubtitle: string;
  uploadBrowse: string;
  uploadDragActive: string;
  uploadLimits: string;

  // Preview
  previewReady: string;
  previewBtnChange: string;
  previewBtnRun: string;

  // Loader Steps
  stepUploading: string;
  stepPreprocessing: string;
  stepRunningModel: string;
  stepIdentifying: string;
  stepPreparingInsights: string;

  // Results
  resultConfidence: string;
  resultUncertainWarn: string;
  resultAnalysisTime: string;
  resultTopPredictions: string;
  resultSymptomsTitle: string;
  resultAboutTitle: string;
  resultCulturalTitle: string;
  resultChemicalTitle: string;
  resultBtnNewAnalysis: string;
  resultCertainBadge: string;
  resultUncertainBadge: string;
  resultHealthyBadge: string;

  // Error
  errorTitle: string;
  errorTryAgain: string;

  // How It Works
  howItWorksBadge: string;
  howItWorksTitle: string;
  howItWorksDesc: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Supported Diseases
  supportedBadge: string;
  supportedTitle: string;
  supportedDesc: string;

  // Footer
  footerDesc: string;
  footerRights: string;
}

export const translations: Record<Language, TranslationDict> = {
  tr: {
    navDetection: "Hastalık Tespiti",
    navHowItWorks: "Nasıl Çalışır?",
    navDiseases: "Hastalıklar",
    navAbout: "Hakkında",
    btnAnalyzeImage: "Görsel Analiz Et",
    statusOnline: "Yapay Zeka Aktif",
    statusOffline: "Çevrimdışı",
    statusConnecting: "Bağlanıyor...",

    heroBadge: "Swin Transformer ile Derin Öğrenme",
    heroTitle1: "Yapay Zeka Destekli",
    heroTitleHighlight: "Buğday Hastalığı",
    heroTitle2: "Teşhis ve Tedavi Sistemi",
    heroDesc:
      "Tarla fotoğraflarınızı saniyeler içinde analiz edin, 15 farklı hastalık ve zararlıyı %98'e varan doğrulukla tespit ederek ziraat mühendisliği onaylı tedavi reçetelerine anında ulaşın.",
    heroBtnStart: "Hemen Analiz Et",
    heroBtnDiseases: "Hastalıkları İncele",
    heroStatAccuracy: "%98.5+",
    heroStatAccuracyDesc: "Model Doğruluk Oranı",
    heroStatDiseases: "15 Sınıf",
    heroStatDiseasesDesc: "Kapsamlı Hastalık Bankası",
    heroStatLatency: "< 500 ms",
    heroStatLatencyDesc: "Hızlı Analiz Süresi",

    secDetectionBadge: "Yapay Zeka Analizi",
    secDetectionTitle: "Buğday Fotoğrafını Analiz Edin",
    secDetectionDesc: "Yaprak veya başak fotoğrafı yükleyerek anında detaylı hastalık teşhisi ve reçete alın.",

    uploadTitle: "Buğday yaprağı veya başak görselini buraya sürükleyin",
    uploadSubtitle: "veya bilgisayarınızdan dosya seçmek için tıklayın",
    uploadBrowse: "Dosya Seç",
    uploadDragActive: "Fotoğrafı buraya bırakın...",
    uploadLimits: "PNG, JPG, JPEG, WEBP · Maksimum 25 MB",

    previewReady: "Görsel analize hazır",
    previewBtnChange: "Fotoğrafı Değiştir",
    previewBtnRun: "Hastalık Analizini Başlat",

    stepUploading: "Görsel sunucuya yükleniyor...",
    stepPreprocessing: "CLAHE & Netlik/Kalite ön işlemleri uygulanıyor...",
    stepRunningModel: "Swin Transformer yapay zeka modeli çalıştırılıyor...",
    stepIdentifying: "Hastalık ve patojen eşleştirmesi yapılıyor...",
    stepPreparingInsights: "Zirai tedavi ve mücadele rehberi hazırlanıyor...",

    resultConfidence: "GÜVEN ORANI",
    resultUncertainWarn: "Düşük kesinlik — sonuç şüpheli olabilir, teyit önerilir.",
    resultAnalysisTime: "Analiz süresi",
    resultTopPredictions: "Olası Teşhisler (Top 3 Dağılımı)",
    resultSymptomsTitle: "🔍 Hastalık Belirtileri & Semptomlar",
    resultAboutTitle: "📖 Hastalık Hakkında Bilimsel Detaylar",
    resultCulturalTitle: "🚜 Kültürel & Tarımsal Önlemler",
    resultChemicalTitle: "🧪 Kimyasal / İlaçlı (Fungisit) Mücadele",
    resultBtnNewAnalysis: "Yeni Bir Görsel Analiz Et",
    resultCertainBadge: "TEŞHİS EDİLDİ",
    resultUncertainBadge: "ŞÜPHELİ / DÜŞÜK GÜVEN",
    resultHealthyBadge: "SAĞLIKLI BİTKİ",

    errorTitle: "Analiz Başarısız Oldu",
    errorTryAgain: "Tekrar Dene",

    howItWorksBadge: "İşlem Adımları",
    howItWorksTitle: "Sistem Nasıl Çalışır?",
    howItWorksDesc: "Fotoğraf yüklemeden ziraat tedavi rehberine uzanan 3 aşamalı akıllı süreç.",
    step1Title: "1. Fotoğraf Yükleme",
    step1Desc: "Tarladan veya laboratuvardan buğday yaprağı ya da başak fotoğrafını yükleyin.",
    step2Title: "2. Görüntü İşleme & Derin Öğrenme",
    step2Desc: "CLAHE kontrast iyileştirmesi ve Swin Transformer mimarisi ile görüntü taranır.",
    step3Title: "3. Teşhis & Reçete Çıktısı",
    step3Desc: "Hastalık adı, güven yüzdesi, kültürel ve kimyasal tedavi önerileri ekrana gelir.",

    supportedBadge: "Kapsam",
    supportedTitle: "Desteklenen 15 Buğday Hastalığı & Durum",
    supportedDesc: "Yapay zeka modelimizin sınıflandırma yapabildiği tüm hastalık türleri.",

    footerDesc: "Yapay zeka destekli akıllı buğday hastalık tespit ve tarımsal karar destek platformu.",
    footerRights: "Tüm hakları saklıdır.",
  },
  en: {
    navDetection: "Detection",
    navHowItWorks: "How It Works",
    navDiseases: "Diseases",
    navAbout: "About",
    btnAnalyzeImage: "Analyze Image",
    statusOnline: "AI Engine Online",
    statusOffline: "Offline",
    statusConnecting: "Connecting...",

    heroBadge: "Deep Learning with Swin Transformer",
    heroTitle1: "AI-Powered",
    heroTitleHighlight: "Wheat Disease",
    heroTitle2: "Detection & Diagnosis",
    heroDesc:
      "Analyze your field images in seconds, diagnose 15 wheat diseases and pests with up to 98% accuracy, and receive certified agronomic treatment guidelines.",
    heroBtnStart: "Start Analysis",
    heroBtnDiseases: "Explore Diseases",
    heroStatAccuracy: "98.5%+",
    heroStatAccuracyDesc: "Model Accuracy",
    heroStatDiseases: "15 Classes",
    heroStatDiseasesDesc: "Comprehensive Database",
    heroStatLatency: "< 500 ms",
    heroStatLatencyDesc: "Fast Inference Time",

    secDetectionBadge: "AI Inference",
    secDetectionTitle: "Analyze Wheat Image",
    secDetectionDesc: "Upload leaf or head photos for instantaneous diagnosis and actionable agronomic solutions.",

    uploadTitle: "Drag & drop a wheat image here",
    uploadSubtitle: "or click to browse from your device",
    uploadBrowse: "Browse Image",
    uploadDragActive: "Drop image here...",
    uploadLimits: "PNG, JPG, JPEG, WEBP · Max 25 MB",

    previewReady: "Image ready for analysis",
    previewBtnChange: "Change Image",
    previewBtnRun: "Run Disease Analysis",

    stepUploading: "Uploading image to server...",
    stepPreprocessing: "Applying CLAHE & quality filters...",
    stepRunningModel: "Running Swin Transformer vision model...",
    stepIdentifying: "Identifying pathogen & disease pattern...",
    stepPreparingInsights: "Formulating treatment recommendations...",

    resultConfidence: "CONFIDENCE",
    resultUncertainWarn: "Low certainty — result may be uncertain, confirmation advised.",
    resultAnalysisTime: "Analysis time",
    resultTopPredictions: "Top Prediction Candidates",
    resultSymptomsTitle: "🔍 Diagnostic Symptoms",
    resultAboutTitle: "📖 Disease Overview & Biology",
    resultCulturalTitle: "🚜 Cultural & Agronomic Management",
    resultChemicalTitle: "🧪 Chemical & Fungicide Treatment",
    resultBtnNewAnalysis: "Analyze Another Image",
    resultCertainBadge: "DIAGNOSED",
    resultUncertainBadge: "UNCERTAIN / SUSPICIOUS",
    resultHealthyBadge: "HEALTHY TISSUE",

    errorTitle: "Analysis Failed",
    errorTryAgain: "Try Again",

    howItWorksBadge: "Workflow",
    howItWorksTitle: "How It Works",
    howItWorksDesc: "A 3-step intelligent pipeline from photo upload to agronomic treatment guide.",
    step1Title: "1. Capture & Upload",
    step1Desc: "Upload a clear photo of wheat leaf or head taken in the field.",
    step2Title: "2. Preprocessing & Deep Learning",
    step2Desc: "Image passes CLAHE contrast enhancement and Swin Transformer classifier.",
    step3Title: "3. Diagnosis & Prescription",
    step3Desc: "Receive instant diagnosis, probability breakdown, and fungicide recommendations.",

    supportedBadge: "Coverage",
    supportedTitle: "15 Supported Diseases & Conditions",
    supportedDesc: "All disease categories classified by our deep neural network.",

    footerDesc: "AI-driven agricultural decision support platform for wheat disease detection.",
    footerRights: "All rights reserved.",
  },
};
