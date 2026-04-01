from __future__ import annotations

import os
import re
import json
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from openai import OpenAI
from dotenv import load_dotenv

from .analytics import (
    ANALYTICS_SNAPSHOT,
    ANALYTICS_SYSTEM_PROMPT,
    build_analytics_user_prompt,
    build_fallback_analytics_ui,
)
from .schemas import GenerateAnalyticsRequest, GenerateAnalyticsResponse

BACKEND_ROOT = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_ROOT.parent

load_dotenv(BACKEND_ROOT / ".env")
load_dotenv(PROJECT_ROOT / ".env")

app = FastAPI(title="OpenUI Analytics API", version="0.1.0")

frontend_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS", "http://localhost:3000,http://localhost:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not configured.")
    return OpenAI(api_key=api_key)


def extract_text_content(content: object) -> str:
    if isinstance(content, str):
        return content

    if not isinstance(content, list):
        return ""

    parts: list[str] = []
    for item in content:
        text_value = getattr(item, "text", None)
        if isinstance(text_value, str):
            parts.append(text_value)
            continue

        if isinstance(item, dict) and isinstance(item.get("text"), str):
            parts.append(item["text"])

    return "".join(parts)


def sanitize_openui_output(output: str) -> str:
    fenced_match = re.search(r"```(?:[a-zA-Z0-9_-]+)?\s*([\s\S]*?)```", output)
    without_fences = fenced_match.group(1).strip() if fenced_match else output.strip()
    root_index = without_fences.find("root =")
    if root_index == -1:
        return without_fences
    return without_fences[root_index:].strip()


def build_sse_event(event: str, data: dict[str, object]) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/analytics/generate")
def generate_analytics(
    _: GenerateAnalyticsRequest | None = None,
) -> StreamingResponse:
    generated_at = datetime.now(timezone.utc).isoformat()

    def event_stream():
        full_output = ""

        try:
            client = get_openai_client()
            yield build_sse_event(
                "metadata",
                {
                    "generatedAt": generated_at,
                    "organization": ANALYTICS_SNAPSHOT["organization"],
                    "periodLabel": ANALYTICS_SNAPSHOT["periodLabel"],
                },
            )

            stream = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-5.2"),
                temperature=0.3,
                stream=True,
                messages=[
                    {"role": "system", "content": ANALYTICS_SYSTEM_PROMPT},
                    {"role": "user", "content": build_analytics_user_prompt()},
                ],
            )

            for chunk in stream:
                if not chunk.choices:
                    continue

                delta = chunk.choices[0].delta
                content = delta.content if delta else None

                if not content:
                    continue

                full_output += content
                yield build_sse_event("chunk", {"delta": content})

            sanitized_output = sanitize_openui_output(full_output)
            final_output = (
                sanitized_output
                if sanitized_output.startswith("root =")
                else build_fallback_analytics_ui()
            )

            payload = GenerateAnalyticsResponse(
                generatedAt=generated_at,
                organization=ANALYTICS_SNAPSHOT["organization"],
                periodLabel=ANALYTICS_SNAPSHOT["periodLabel"],
                output=final_output,
            )
            yield build_sse_event("complete", payload.model_dump())
        except HTTPException as exc:
            yield build_sse_event("error", {"message": str(exc.detail)})
        except Exception as exc:  # pragma: no cover - runtime API failures
            yield build_sse_event("error", {"message": str(exc)})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
