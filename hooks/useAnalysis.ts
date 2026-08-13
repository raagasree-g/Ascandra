"use client";

import { useState } from "react";
import type {
  AnalysisPayload,
  AnalysisResponse,
} from "@/lib/types";
import { analyzeBusiness } from "@/lib/api";

export function useAnalysis() {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(payload: AnalysisPayload) {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeBusiness(payload);

      setData(result);

      sessionStorage.setItem(
        "ascandra-analysis",
        JSON.stringify(result),
      );

      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze the business.";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  function clearAnalysis() {
    setData(null);
    setError(null);
    sessionStorage.removeItem("ascandra-analysis");
  }

  return {
    analyze,
    data,
    loading,
    error,
    clearAnalysis,
  };
}