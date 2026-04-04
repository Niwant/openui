import { z } from "zod";

const chartThemes = ["ocean", "orchid", "emerald", "spectrum", "sunset", "vivid"] as const;

export const chartThemeSchema = z.enum(chartThemes);

export const baseChartAppearanceShape = {
  theme: chartThemeSchema.optional(),
  legend: z.boolean().optional(),
  animated: z.boolean().optional(),
};

export const baseChartAppearanceSchema = z.object(baseChartAppearanceShape);

export const gridChartAppearanceShape = {
  ...baseChartAppearanceShape,
  showGrid: z.boolean().optional(),
};

export const gridChartAppearanceSchema = z.object(gridChartAppearanceShape);

export const cartesianChartAppearanceShape = {
  ...gridChartAppearanceShape,
  xLabel: z.string().optional(),
  yLabel: z.string().optional(),
};

export const cartesianChartAppearanceSchema = z.object(cartesianChartAppearanceShape);

export const proportionalChartAppearanceShape = {
  ...baseChartAppearanceShape,
  format: z.enum(["number", "percentage"]).optional(),
};

export const proportionalChartAppearanceSchema = z.object(proportionalChartAppearanceShape);

export const radialChartAppearanceShape = {
  ...proportionalChartAppearanceShape,
  showGrid: z.boolean().optional(),
};

export const radialChartAppearanceSchema = z.object(radialChartAppearanceShape);

type BaseChartAppearance = z.infer<typeof baseChartAppearanceSchema>;
type CartesianChartAppearance = z.infer<typeof cartesianChartAppearanceSchema>;
type ProportionalChartAppearance = z.infer<typeof proportionalChartAppearanceSchema>;
type RadialChartAppearance = z.infer<typeof radialChartAppearanceSchema>;

export function getBaseChartProps(props: BaseChartAppearance) {
  return {
    theme: props.theme,
    legend: props.legend,
    isAnimationActive: props.animated ?? false,
  };
}

export function getCartesianChartProps(props: CartesianChartAppearance) {
  return {
    ...getBaseChartProps(props),
    grid: props.showGrid,
    xAxisLabel: props.xLabel,
    yAxisLabel: props.yLabel,
  };
}

export function getGridChartProps(props: z.infer<typeof gridChartAppearanceSchema>) {
  return {
    ...getBaseChartProps(props),
    grid: props.showGrid,
  };
}

export function getProportionalChartProps(props: ProportionalChartAppearance) {
  return {
    ...getBaseChartProps(props),
    format: props.format,
  };
}

export function getRadialChartProps(props: RadialChartAppearance) {
  return {
    ...getProportionalChartProps(props),
    grid: props.showGrid,
  };
}

export function getSingleStackedBarProps(props: BaseChartAppearance) {
  return {
    theme: props.theme,
    legend: props.legend,
    animated: props.animated ?? false,
  };
}
