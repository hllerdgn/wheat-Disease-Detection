import { useState, useCallback } from "react";
import { analyzeImage } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";
import type { AnalyzeResponse, AppState } from "@/types/prediction";

interface PredictionState {
  appState: AppState;
  file: File | null;
  previewUrl: string | null;
  result: AnalyzeResponse | null;
  error: string | null;
  analysisStep: number;
}

export function usePrediction() {
  const { t } = useLanguage();
  const [state, setState] = useState<PredictionState>({
    appState: "idle",
    file: null,
    previewUrl: null,
    result: null,
    error: null,
    analysisStep: 0,
  });

  const analysisSteps = [
    t.stepUploading,
    t.stepPreprocessing,
    t.stepRunningModel,
    t.stepIdentifying,
    t.stepPreparingInsights,
  ];

  const selectFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setState((prev) => {
      if (prev.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return {
        appState: "preview",
        file,
        previewUrl: url,
        result: null,
        error: null,
        analysisStep: 0,
      };
    });
  }, []);

  const analyze = useCallback(async () => {
    setState((prev) => ({ ...prev, appState: "analyzing", analysisStep: 0, error: null }));

    const stepInterval = setInterval(() => {
      setState((prev) => {
        if (prev.analysisStep < analysisSteps.length - 1) {
          return { ...prev, analysisStep: prev.analysisStep + 1 };
        }
        return prev;
      });
    }, 600);

    try {
      const file = state.file;
      if (!file) throw new Error("No file selected");
      const result = await analyzeImage(file);
      clearInterval(stepInterval);
      setState((prev) => ({
        ...prev,
        appState: "result",
        result,
        analysisStep: analysisSteps.length - 1,
      }));
    } catch (err) {
      clearInterval(stepInterval);
      const message =
        err instanceof Error ? err.message : "Analiz başarısız oldu. Lütfen tekrar deneyin.";
      setState((prev) => ({ ...prev, appState: "error", error: message }));
    }
  }, [state.file, analysisSteps.length]);

  const reset = useCallback(() => {
    setState((prev) => {
      if (prev.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return {
        appState: "idle",
        file: null,
        previewUrl: null,
        result: null,
        error: null,
        analysisStep: 0,
      };
    });
  }, []);

  const changeImage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      appState: "idle",
      file: null,
      previewUrl: prev.previewUrl ? (URL.revokeObjectURL(prev.previewUrl), null) : null,
      result: null,
      error: null,
    }));
  }, []);

  return {
    ...state,
    analysisSteps,
    selectFile,
    analyze,
    reset,
    changeImage,
  };
}
