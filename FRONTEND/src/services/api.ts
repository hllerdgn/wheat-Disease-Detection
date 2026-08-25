import type {
  AnalyzeResponse,
  HealthResponse,
  DiseaseListResponse,
  DiseaseDetail,
} from "@/types/prediction";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export async function analyzeImage(file: File, skipQuality: boolean = false): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const queryParams = skipQuality ? "?skip_quality=true" : "";
  const response = await fetch(`${BASE_URL}/analyze${queryParams}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Analysis failed: ${response.status} — ${errorText}`);
  }

  return response.json() as Promise<AnalyzeResponse>;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${BASE_URL}/health`, {
    method: "GET",
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) throw new Error("Health check failed");
  return response.json() as Promise<HealthResponse>;
}

export async function getSupportedDiseases(): Promise<DiseaseListResponse> {
  const response = await fetch(`${BASE_URL}/diseases`, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to fetch supported diseases");
  return response.json() as Promise<DiseaseListResponse>;
}

export async function getDiseaseDetail(diseaseName: string): Promise<DiseaseDetail> {
  const response = await fetch(`${BASE_URL}/diseases/${encodeURIComponent(diseaseName)}`, {
    method: "GET",
  });

  if (!response.ok) throw new Error(`Failed to fetch details for ${diseaseName}`);
  return response.json() as Promise<DiseaseDetail>;
}
