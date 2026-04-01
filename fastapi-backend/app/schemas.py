from __future__ import annotations

from pydantic import BaseModel, Field


class GenerateAnalyticsRequest(BaseModel):
    organization_id: str | None = Field(
        default=None, description="Optional tenant or organization identifier."
    )
    dashboard_id: str | None = Field(
        default=None, description="Optional dashboard template identifier."
    )


class GenerateAnalyticsResponse(BaseModel):
    generatedAt: str
    organization: str
    periodLabel: str
    output: str
