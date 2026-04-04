"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { PieChart as PieChartComponent } from "../../components/Charts";
import { buildSliceData, hasAllProps } from "../helpers";
import { SliceSchema } from "./Slice";
import { getProportionalChartProps, proportionalChartAppearanceShape } from "./shared";

export const PieChartSchema = z.object({
  slices: z.array(SliceSchema),
  variant: z.enum(["pie", "donut"]).optional(),
  ...proportionalChartAppearanceShape,
});

export const PieChart = defineComponent({
  name: "PieChart",
  props: PieChartSchema,
  description:
    'Circular slices for part-to-whole comparisons; after slices and optional variant you can set theme, legend, animated, and format as "number" or "percentage"',
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "slices")) return null;
    const data = buildSliceData(props.slices);
    if (!data.length) return null;
    return React.createElement(PieChartComponent, {
      data,
      categoryKey: "category",
      dataKey: "value",
      variant: props.variant as "pie" | "donut" | undefined,
      ...getProportionalChartProps(props),
    });
  },
});
