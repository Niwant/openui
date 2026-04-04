"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { SingleStackedBar as SingleStackedBarChartComponent } from "../../components/Charts";
import { buildSliceData, hasAllProps } from "../helpers";
import { SliceSchema } from "./Slice";
import { baseChartAppearanceShape, getSingleStackedBarProps } from "./shared";

export const SingleStackedBarChartSchema = z.object({
  slices: z.array(SliceSchema),
  ...baseChartAppearanceShape,
});

export const SingleStackedBarChart = defineComponent({
  name: "SingleStackedBarChart",
  props: SingleStackedBarChartSchema,
  description:
    "Single horizontal stacked bar for one-row part-to-whole proportions; after slices you can set theme, legend, and animated",
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "slices")) return null;
    const data = buildSliceData((props as any).slices);
    if (!data.length) return null;
    return React.createElement(SingleStackedBarChartComponent, {
      data,
      categoryKey: "category",
      dataKey: "value",
      ...getSingleStackedBarProps(props),
    });
  },
});
