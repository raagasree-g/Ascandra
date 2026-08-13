import type {
  AnalysisPayload,
  AnalysisResponse,
} from "./types";

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      text,
    };
  }
}

export async function analyzeBusiness(
  payload: AnalysisPayload,
): Promise<AnalysisResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data?.error || "Business analysis failed.",
    );
  }

  return data as AnalysisResponse;
}