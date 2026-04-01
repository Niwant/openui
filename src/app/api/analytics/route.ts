import OpenAI from "openai";

import {
  analyticsSnapshot,
  analyticsSystemPrompt,
  buildAnalyticsUserPrompt,
  buildFallbackAnalyticsUi,
} from "@/lib/analytics";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function extractTextContent(content: unknown) {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (
        item &&
        typeof item === "object" &&
        "text" in item &&
        typeof item.text === "string"
      ) {
        return item.text;
      }

      return "";
    })
    .join("");
}

function sanitizeOpenUiOutput(output: string) {
  const fencedMatch = output.match(/```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```/);
  const withoutFences = fencedMatch ? fencedMatch[1].trim() : output.trim();
  const rootIndex = withoutFences.indexOf("root =");

  if (rootIndex === -1) {
    return withoutFences;
  }

  return withoutFences.slice(rootIndex).trim();
}

export async function POST() {
  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: "gpt-5.2",
      temperature: 0.3,
      messages: [
        { role: "system", content: analyticsSystemPrompt },
        { role: "user", content: buildAnalyticsUserPrompt() },
      ],
    });

    const rawOutput = extractTextContent(completion.choices[0]?.message?.content);
    const output = sanitizeOpenUiOutput(rawOutput);

    return Response.json({
      generatedAt: new Date().toISOString(),
      organization: analyticsSnapshot.organization,
      periodLabel: analyticsSnapshot.periodLabel,
      output: output.startsWith("root =") ? output : buildFallbackAnalyticsUi(),
    });
  } catch (error) {
    console.error(error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
