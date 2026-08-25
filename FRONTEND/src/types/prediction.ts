export interface Top3Prediction {
  class: string;
  score: number;
}

export interface ClassificationResult {
  predicted_class: string;
  confidence: number;
  is_certain: boolean;
  top3_predictions: Top3Prediction[];
}

export interface QualityResult {
  is_valid: boolean;
  blur_score: number;
  warnings: string[];
  rejection_reason: string | null;
}

export interface MetaResult {
  processing_time_ms: number;
  image_size: {
    width: number;
    height: number;
  };
}

export interface DiseaseDetail {
  key: string;
  name: string;
  name_tr: string;
  scientific_name: string;
  severity: "healthy" | "warning" | "disease";
  risk_level: "none" | "low" | "medium" | "high" | "critical";
  short_desc: string;
  description: string;
  symptoms: string[];
  cultural_treatment: string[];
  chemical_treatment: string[];
}

export interface AnalyzeResponse {
  classification: ClassificationResult;
  quality: QualityResult;
  meta: MetaResult;
  disease_info?: DiseaseDetail | null;
}

export interface HealthResponse {
  status: "ok" | "degraded" | "error";
  pipeline_ready: boolean;
  model_loaded: boolean;
  device: string;
  num_classes: number;
  version?: string;
  error: string | null;
}

export interface DiseaseListItem {
  key: string;
  name: string;
  name_tr: string;
  scientific_name: string;
  severity: string;
  risk_level: string;
  short_desc: string;
}

export interface DiseaseListResponse {
  total: number;
  diseases: DiseaseListItem[];
}

export type AppState = "idle" | "preview" | "analyzing" | "result" | "error";

export type ApiStatus = "checking" | "online" | "offline";
