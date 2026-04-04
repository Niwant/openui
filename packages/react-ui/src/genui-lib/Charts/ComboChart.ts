"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { ComboChart as ComboChartComponent } from "../../components/Charts";
import { buildChartData, hasAllProps } from "../helpers";
import { ComboSeriesSchema } from "./ComboSeries";
import { cartesianChartAppearanceShape, getCartesianChartProps } from "./shared";

export const ComboChartSchema = z.object({
  labels: z.array(z.string()),
  series: z.array(ComboSeriesSchema),
  ...cartesianChartAppearanceShape,
});

function getSeriesKinds(series: any[]) {
  return series.reduce<Record<string, "bar" | "line">>((acc, entry) => {
    const props = entry?.type === "element" ? entry.props : entry;
    const category = props?.category;
    const kind = props?.type;

    if (typeof category === "string" && (kind === "bar" || kind === "line")) {
      acc[category] = kind;
    }

    return acc;
  }, {});
}

export const ComboChart = defineComponent({
  name: "ComboChart",
  props: ComboChartSchema,
  description:
    "Mixed bar-and-line chart for comparing totals with trends or targets; after labels and series you can set theme, legend, animated, showGrid, xLabel, and yLabel. Use ComboSeries with type bar or line",
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "labels", "series")) return null;

    const comboSeries = Array.isArray((props as any).series)
      ? ((props as any).series as any[])
      : [];
    const data = buildChartData((props as any).labels, comboSeries);

    return React.createElement(ComboChartComponent, {
      data,
      categoryKey: "category",
      seriesKinds: getSeriesKinds(comboSeries),
      ...getCartesianChartProps(props),
    });
  },
});
