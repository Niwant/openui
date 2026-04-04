"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { RadarChart as RadarChartComponent } from "../../components/Charts";
import { buildChartData, hasAllProps } from "../helpers";
import { SeriesSchema } from "./Series";
import { getGridChartProps, gridChartAppearanceShape } from "./shared";

export const RadarChartSchema = z.object({
  labels: z.array(z.string()),
  series: z.array(SeriesSchema),
  ...gridChartAppearanceShape,
});

export const RadarChart = defineComponent({
  name: "RadarChart",
  props: RadarChartSchema,
  description:
    "Spider/web chart for comparing multiple variables; after labels and series you can set theme, legend, animated, and showGrid",
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "labels", "series")) return null;
    const data = buildChartData(props.labels, props.series);
    if (!data.length) return null;
    return React.createElement(RadarChartComponent, {
      data,
      categoryKey: "category",
      ...getGridChartProps(props),
    });
  },
});
