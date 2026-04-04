"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { AreaChart as AreaChartCondensedComponent } from "../../components/Charts";
import { buildChartData, hasAllProps } from "../helpers";
import { SeriesSchema } from "./Series";
import { cartesianChartAppearanceShape, getCartesianChartProps } from "./shared";

export const AreaChartCondensedSchema = z.object({
  labels: z.array(z.string()),
  series: z.array(SeriesSchema),
  variant: z.enum(["linear", "natural", "step"]).optional(),
  ...cartesianChartAppearanceShape,
});

export const AreaChartCondensed = defineComponent({
  name: "AreaChart",
  props: AreaChartCondensedSchema,
  description:
    "Filled area chart for cumulative totals or volume trends; after labels, series, and optional variant you can set theme, legend, animated, showGrid, xLabel, and yLabel",
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "labels", "series")) return null;
    const data = buildChartData(props.labels, props.series);
    if (!data.length) return null;
    return React.createElement(AreaChartCondensedComponent, {
      data,
      categoryKey: "category",
      variant: props.variant as "linear" | "natural" | "step" | undefined,
      ...getCartesianChartProps(props),
    });
  },
});
