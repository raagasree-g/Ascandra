import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const webhookUrl = process.env.ASCANDRA_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        {
          error:
            "ASCANDRA_N8N_WEBHOOK_URL is not configured.",
        },
        { status: 500 },
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await response.text();

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        text,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "The Ascandra backend returned an error.",
          details: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Ascandra API error:", error);

    return NextResponse.json(
      {
        error: "Unable to connect to the Ascandra backend.",
      },
      { status: 500 },
    );
  }
}