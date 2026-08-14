import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const webhookUrl =
      process.env.N8N_MASTER_ORCHESTRATOR_URL;

    if (!webhookUrl) {
      console.error(
        "N8N_MASTER_ORCHESTRATOR_URL is missing",
      );

      return NextResponse.json(
        {
          error:
            "N8N_MASTER_ORCHESTRATOR_URL is not configured.",
        },
        { status: 500 },
      );
    }

    console.log(
      "Sending request to n8n:",
      webhookUrl,
    );

    const response = await fetch(webhookUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),

      cache: "no-store",
    });

    const text = await response.text();

    console.log(
      "n8n HTTP status:",
      response.status,
    );

    console.log(
      "n8n raw response:",
      text,
    );

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        text,
      };
    }

    if (!response.ok) {
      console.error(
        "n8n returned an error:",
        data,
      );

      return NextResponse.json(
        {
          error:
            "The Ascandra backend returned an error.",
          details: data,
        },
        {
          status: response.status,
        },
      );
    }

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "ASCANDRA BACKEND CONNECTION ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to connect to the Ascandra backend.",

        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      },
    );
  }
}