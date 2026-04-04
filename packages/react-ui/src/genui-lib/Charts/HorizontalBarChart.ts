"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { HorizontalBarChart as HorizontalBarChartComponent } from "../../components/Charts";
import { buildChartData, hasAllProps } from "../helpers";
import { SeriesSchema } from "./Series";
import { cartesianChartAppearanceShape, getCartesianChartProps } from "./shared";

export const HorizontalBarChartSchema = z.object({
  labels: z.array(z.string()),
  series: z.array(SeriesSchema),
  variant: z.enum(["grouped", "stacked"]).optional(),
  ...cartesianChartAppearanceShape,
});

export const HorizontalBarChart = defineComponent({
  name: "HorizontalBarChart",
  props: HorizontalBarChartSchema,
  description:
    "Horizontal bars for ranked lists or long labels; after labels, series, and optional variant you can set theme, legend, animated, showGrid, xLabel, and yLabel",
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "labels", "series")) return null;
    const data = buildChartData(props.labels, props.series);
    if (!data.length) return null;
    return React.createElement(HorizontalBarChartComponent, {
      data,
      categoryKey: "category",
      variant: props.variant as "grouped" | "stacked" | undefined,
      ...getCartesianChartProps(props),
    });
  },
});
