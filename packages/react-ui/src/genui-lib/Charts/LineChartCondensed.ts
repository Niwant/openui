"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { LineChart as LineChartCondensedComponent } from "../../components/Charts";
import { buildChartData, hasAllProps } from "../helpers";
import { SeriesSchema } from "./Series";
import { cartesianChartAppearanceShape, getCartesianChartProps } from "./shared";

export const LineChartCondensedSchema = z.object({
  labels: z.array(z.string()),
  series: z.array(SeriesSchema),
  variant: z.enum(["linear", "natural", "step"]).optional(),
  ...cartesianChartAppearanceShape,
});

export const LineChartCondensed = defineComponent({
  name: "LineChart",
  props: LineChartCondensedSchema,
  description:
    "Lines over categories for trends over time; after labels, series, and optional variant you can set theme, legend, animated, showGrid, xLabel, and yLabel",
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "labels", "series")) return null;
    const data = buildChartData(props.labels, props.series);
    if (!data.length) return null;
    return React.createElement(LineChartCondensedComponent, {
      data,
      categoryKey: "category",
      variant: props.variant as "linear" | "natural" | "step" | undefined,
      ...getCartesianChartProps(props),
    });
  },
});
