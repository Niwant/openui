"use client";
import "@openuidev/react-ui/components.css";
import "@openuidev/react-ui/styles/index.css";

import { useState } from "react";

import { Renderer } from "@openuidev/react-lang";
import { openuiLibrary } from "@openuidev/react-ui/genui-lib";

import { consumeAnalyticsResponse } from "@/lib/consumeAnalyticsResponse";

const analyticsApiUrl =
  process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? "/api/analytics";

export default function Home() {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  async function handleGenerateAnalytics() {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setGeneratedAt(null);

    try {
      const result = await fetch(analyticsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      await consumeAnalyticsResponse(result, {
        onMetadata(payload) {
          setGeneratedAt(payload.generatedAt ?? null);
        },
        onChunk(delta) {
          setResponse((current) => `${current ?? ""}${delta}`);
        },
        onComplete(payload) {
          setResponse(payload.output ?? null);
          setGeneratedAt(payload.generatedAt ?? null);
        },
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Analytics generation failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.18),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#fff7ed_100%)] px-6 py-8 text-slate-900 sm:px-10 lg:px-16 lg:py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
              One-shot analytics generation
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
              Generate an executive analytics view from a backend-owned prompt.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              This prototype skips chat entirely. A single action calls the server,
              applies a fixed analytics brief, sends verified metrics to OpenAI,
              and renders the returned OpenUI layout in place.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleGenerateAnalytics}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-500"
              >
                {isLoading ? "Generating analytics..." : "Generate analytics view"}
              </button>
              <p className="text-sm text-slate-500">
                Prompt, model choice, and API key stay on the server at
                <span className="font-mono"> {analyticsApiUrl}</span>.
              </p>
            </div>
            {generatedAt ? (
              <p className="mt-6 text-sm text-slate-500">
                Last generated at {new Date(generatedAt).toLocaleString()}.
              </p>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-slate-200/70 bg-slate-950 p-8 text-slate-100 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.6)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              Backend brief
            </p>
            <div className="mt-6 space-y-5 text-sm leading-7 text-slate-300">
              <p>
                The API composes an executive dashboard brief from verified revenue,
                pipeline, retention, and account-risk data.
              </p>
              <p>
                OpenUI output is constrained to a small analytics-safe component set:
                cards, tables, charts, and a single executive takeaway.
              </p>
              <p>
                This mirrors the production pattern you described for a React frontend
                talking to a FastAPI backend over a configurable API URL.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
                Rendered output
              </p>
              <h2 className="mt-2 font-serif text-2xl text-slate-950">
                OpenUI analytics canvas
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              The frontend renders the generated OpenUI program directly.
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {response ? (
            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
              <Renderer
                response={response}
                library={openuiLibrary}
                isStreaming={isLoading}
              />
            </div>
          ) : (
            <div className="mt-6 rounded-[1.75rem] border border-dashed border-slate-300 bg-[linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(248,250,252,0.9))] px-6 py-12 text-center text-slate-500">
              <p className="font-serif text-2xl text-slate-900">
                No analytics generated yet.
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7">
                Trigger the server action to generate a dashboard from the predefined
                analytics brief and render it here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
