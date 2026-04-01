type AnalyticsPayload = {
  generatedAt?: string;
  organization?: string;
  periodLabel?: string;
  output?: string;
  error?: string;
  detail?: string;
};

type AnalyticsStreamHandlers = {
  onMetadata?: (payload: AnalyticsPayload) => void;
  onChunk?: (delta: string) => void;
  onComplete?: (payload: AnalyticsPayload) => void;
};

function parseEventBlock(block: string) {
  let eventName = "message";
  const dataLines: string[] = [];

  for (const rawLine of block.split("\n")) {
    const line = rawLine.trimEnd();

    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
      continue;
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  if (dataLines.length === 0) {
    return null;
  }

  return {
    eventName,
    payload: JSON.parse(dataLines.join("\n")) as AnalyticsPayload & {
      delta?: string;
      message?: string;
    },
  };
}

export async function consumeAnalyticsResponse(
  response: Response,
  handlers: AnalyticsStreamHandlers,
) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    if (contentType.includes("application/json")) {
      const payload = (await response.json()) as AnalyticsPayload;
      throw new Error(
        payload.error ?? payload.detail ?? "Analytics generation failed.",
      );
    }

    throw new Error(`Analytics generation failed with status ${response.status}.`);
  }

  if (!contentType.includes("text/event-stream")) {
    const payload = (await response.json()) as AnalyticsPayload;

    if (!payload.output) {
      throw new Error(
        payload.error ?? payload.detail ?? "Analytics generation failed.",
      );
    }

    handlers.onComplete?.(payload);
    return;
  }

  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("Analytics stream was empty.");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });

    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";

    for (const block of blocks) {
      const parsed = parseEventBlock(block);

      if (!parsed) {
        continue;
      }

      if (parsed.eventName === "metadata") {
        handlers.onMetadata?.(parsed.payload);
        continue;
      }

      if (parsed.eventName === "chunk") {
        handlers.onChunk?.(parsed.payload.delta ?? "");
        continue;
      }

      if (parsed.eventName === "complete") {
        handlers.onComplete?.(parsed.payload);
        continue;
      }

      if (parsed.eventName === "error") {
        throw new Error(
          parsed.payload.message ?? "Analytics generation failed.",
        );
      }
    }

    if (done) {
      break;
    }
  }
}
