"use client";

import { defineComponent } from "@openuidev/react-lang";
import React from "react";
import { z } from "zod";
import { BubbleChart as BubbleChartComponent } from "../../components/Charts";
import { asArray, hasAllProps } from "../helpers";
import { BubbleSeriesSchema } from "./BubbleSeries";
import { cartesianChartAppearanceShape, getCartesianChartProps } from "./shared";

export const BubbleChartSchema = z.object({
  datasets: z.array(BubbleSeriesSchema),
  ...cartesianChartAppearanceShape,
});

const unwrap = (node: any) => (node?.type === "element" ? node.props : node);

export const BubbleChart = defineComponent({
  name: "BubbleChart",
  props: BubbleChartSchema,
  description:
    "Bubble chart for three-variable comparisons; after datasets you can set theme, legend, animated, showGrid, xLabel, and yLabel. Each BubblePoint must include x, y, and z where z controls bubble size",
  component: ({ props }) => {
    if (!hasAllProps(props as Record<string, unknown>, "datasets")) return null;

    const rawDatasets = asArray((props as any).datasets);
    const data = rawDatasets.map((ds: any) => {
      const dsProps = unwrap(ds);
      const rawPoints = asArray(dsProps?.points);

      return {
        name: (dsProps?.name ?? "") as string,
        data: rawPoints.map((pt: any) => {
          const ptProps = unwrap(pt);
          return {
            x: Number(ptProps?.x),
            y: Number(ptProps?.y),
            z: Number(ptProps?.z),
          };
        }),
      };
    });

    if (!data.length) return null;

    return React.createElement(BubbleChartComponent, {
      data,
      xAxisDataKey: "x",
      yAxisDataKey: "y",
      zAxisDataKey: "z",
      ...getCartesianChartProps(props),
    });
  },
});
