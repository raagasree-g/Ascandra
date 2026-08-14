import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured.",
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();

    const audio = formData.get("audio");
    const language = formData.get("language");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        {
          error: "No audio file was provided.",
        },
        { status: 400 },
      );
    }

    if (audio.size === 0) {
      return NextResponse.json(
        {
          error: "The audio file is empty.",
        },
        { status: 400 },
      );
    }

    const audioBytes = await audio.arrayBuffer();

    const base64Audio = Buffer.from(audioBytes).toString(
      "base64",
    );

    const mimeType =
      audio.type || "audio/ogg";

    const ai = new GoogleGenAI({
      apiKey,
    });

    const languageInstruction =
      typeof language === "string" && language
        ? `The expected language is ${language}.`
        : "Automatically detect the spoken language.";

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are Ascandra's speech-to-text engine.

Transcribe ONLY what the user said.

Do not summarize.
Do not explain.
Do not add information.
Do not answer the user's question.

Preserve the meaning and wording as accurately as possible.

${languageInstruction}

Return only the transcription as plain text.
                `.trim(),
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Audio,
                },
              },
            ],
          },
        ],
      });

    const transcript =
      response.text?.trim() || "";

    if (!transcript) {
      return NextResponse.json(
        {
          error:
            "No speech could be transcribed from the recording.",
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      transcript,
      language:
        typeof language === "string"
          ? language
          : null,
    });
  } catch (error) {
    console.error(
      "Ascandra Gemini voice error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Voice transcription failed.",
      },
      { status: 500 },
    );
  }
}