"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { FunnelChart as FunnelChartComponent } from "../../components/Charts";
import { buildSliceData, hasAllProps } from "../helpers";
import { FunnelItemSchema } from "./FunnelItem";
import { getProportionalChartProps, proportionalChartAppearanceShape } from "./shared";

export const FunnelChartSchema = z.object({
  items: z.array(FunnelItemSchema),
  ...proportionalChartAppearanceShape,
});

export const FunnelChart = defineComponent({
  name: "FunnelChart",
  props: FunnelChartSchema,
  description:
    'Funnel chart for showing stages in a process like conversion or drop-off; after items you can set theme, legend, animated, and format as "number" or "percentage"',
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "items")) return null;

    const data = buildSliceData((props as any).items);
    if (!data.length) return null;

    return React.createElement(FunnelChartComponent, {
      data,
      categoryKey: "category",
      dataKey: "value",
      ...getProportionalChartProps(props),
    });
  },
});
