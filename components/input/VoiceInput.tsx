"use client";

import { useRef, useState } from "react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  disabled?: boolean;
}

export default function VoiceInput({
  onTranscript,
  language = "en",
  disabled = false,
}: VoiceInputProps) {
  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const chunksRef =
    useRef<Blob[]>([]);

  const [recording, setRecording] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  async function startRecording() {
    try {
      setError("");

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setError(
          "Microphone recording is not supported by this browser.",
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;

      /*
       * Prefer OGG/Opus because Gemini officially
       * supports OGG audio.
       */
      const preferredTypes = [
        "audio/ogg;codecs=opus",
        "audio/ogg",
        "audio/webm;codecs=opus",
        "audio/webm",
      ];

      const mimeType =
        preferredTypes.find((type) =>
          MediaRecorder.isTypeSupported(type),
        ) || "";

      if (!mimeType) {
        stream
          .getTracks()
          .forEach((track) => track.stop());

        setError(
          "This browser does not support a compatible recording format.",
        );

        return;
      }

      const recorder =
        new MediaRecorder(stream, {
          mimeType,
        });

      mediaRecorderRef.current =
        recorder;

      chunksRef.current = [];

      recorder.ondataavailable = (
        event,
      ) => {
        if (event.data.size > 0) {
          chunksRef.current.push(
            event.data,
          );
        }
      };

      recorder.onstop = async () => {
        const recordedType =
          recorder.mimeType;

        const audioBlob = new Blob(
          chunksRef.current,
          {
            type: recordedType,
          },
        );

        stream
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;

        await transcribeAudio(
          audioBlob,
        );
      };

      recorder.onerror = () => {
        setRecording(false);

        stream
          .getTracks()
          .forEach((track) => track.stop());

        setError(
          "An error occurred while recording.",
        );
      };

      recorder.start();

      setRecording(true);
    } catch (error) {
      console.error(
        "Microphone error:",
        error,
      );

      if (
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        setError(
          "Microphone permission was denied. Allow microphone access and try again.",
        );
      } else if (
        error instanceof DOMException &&
        error.name === "NotFoundError"
      ) {
        setError(
          "No microphone was found.",
        );
      } else {
        setError(
          "Unable to access the microphone.",
        );
      }
    }
  }

  function stopRecording() {
    const recorder =
      mediaRecorderRef.current;

    if (
      !recorder ||
      recorder.state === "inactive"
    ) {
      return;
    }

    setRecording(false);

    recorder.stop();
  }

  async function transcribeAudio(
    audioBlob: Blob,
  ) {
    try {
      setProcessing(true);
      setError("");

      if (audioBlob.size === 0) {
        throw new Error(
          "The recorded audio is empty.",
        );
      }

      const formData =
        new FormData();

      const extension =
        audioBlob.type.includes(
          "ogg",
        )
          ? "ogg"
          : "webm";

      const audioFile = new File(
        [audioBlob],
        `ascandra-voice.${extension}`,
        {
          type: audioBlob.type,
        },
      );

      formData.append(
        "audio",
        audioFile,
      );

      formData.append(
        "language",
        language,
      );

      const response =
        await fetch(
          "/api/voice",
          {
            method: "POST",
            body: formData,
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Voice transcription failed.",
        );
      }

      const transcript =
        typeof data.transcript ===
        "string"
          ? data.transcript.trim()
          : "";

      if (!transcript) {
        throw new Error(
          "No speech was detected.",
        );
      }

      onTranscript(transcript);
    } catch (error) {
      console.error(
        "Transcription error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to transcribe voice input.",
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="voice-input">
      {!recording ? (
        <button
          type="button"
          className="secondary-button"
          onClick={startRecording}
          disabled={
            disabled ||
            processing
          }
        >
          🎙 Start Voice Input
        </button>
      ) : (
        <button
          type="button"
          className="primary-button"
          onClick={stopRecording}
          disabled={processing}
        >
          ⏹ Stop Recording
        </button>
      )}

      {recording && (
        <p className="input-hint">
          🎙 Recording... Speak now.
        </p>
      )}

      {processing && (
        <p className="input-hint">
          Processing your voice...
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}
    </div>
  );
}