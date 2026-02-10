/**
 * Proxy: forwards to backend POST /api/v1/chats/:id/messages?stream=true
 * and converts SSE (data: {"type":"content","content":"X"}) into a plain text
 * stream for Vercel AI SDK TextStreamChatTransport.
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      chatId,
    } = body as {
      messages?: { role: string; parts?: { type: string; text?: string }[] }[];
      chatId?: string;
    };

    if (!chatId || typeof chatId !== "string") {
      return NextResponse.json({ error: "chatId is required" }, { status: 400 });
    }

    const list = Array.isArray(messages) ? messages : [];
    const lastUser = [...list].reverse().find((m) => m.role === "user");
    const content =
      (lastUser?.parts?.find((p) => p.type === "text") as { text?: string } | undefined)
        ?.text ?? "";

    if (!content.trim()) {
      return NextResponse.json(
        { error: "No user message content" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const res = await fetch(
      `${BACKEND_URL}/api/v1/chats/${chatId}/messages?stream=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({ content: content.trim(), role: "user" }),
        signal: request.signal,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: errText || `Backend ${res.status}` },
        { status: res.status }
      );
    }

    const bodyStream = res.body;
    if (!bodyStream) {
      return NextResponse.json(
        { error: "No response body" },
        { status: 502 }
      );
    }

    const reader = bodyStream.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          for (; ;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const payload = line.slice(6);
                if (payload === "[DONE]") continue;
                try {
                  const data = JSON.parse(payload) as {
                    type?: string;
                    content?: string;
                  };
                  if (
                    data.type === "content" &&
                    typeof data.content === "string"
                  ) {
                    controller.enqueue(
                      new TextEncoder().encode(data.content)
                    );
                  }
                } catch {
                  // ignore non-JSON lines
                }
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
