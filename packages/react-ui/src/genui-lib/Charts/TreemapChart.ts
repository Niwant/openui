"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { TreemapChart as TreemapChartComponent } from "../../components/Charts";
import { buildSliceData, hasAllProps } from "../helpers";
import { getProportionalChartProps, proportionalChartAppearanceShape } from "./shared";
import { TreemapItemSchema } from "./TreemapItem";

export const TreemapChartSchema = z.object({
  items: z.array(TreemapItemSchema),
  ...proportionalChartAppearanceShape,
});

export const TreemapChart = defineComponent({
  name: "TreemapChart",
  props: TreemapChartSchema,
  description:
    'Treemap for comparing many categories as sized rectangles; after items you can set theme, legend, animated, and format as "number" or "percentage"',
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "items")) return null;

    const data = buildSliceData((props as any).items);
    if (!data.length) return null;

    return React.createElement(TreemapChartComponent, {
      data,
      categoryKey: "category",
      dataKey: "value",
      ...getProportionalChartProps(props),
    });
  },
});
