import { ScatterChart, type ScatterChartProps } from "../ScatterChart";

export interface BubbleChartProps extends Omit<ScatterChartProps, "shape"> {}

export const BubbleChart = (props: BubbleChartProps) => {
  const shouldShowLegend = props.legend ?? props.data.length > 1;

  return (
    <ScatterChart
      {...props}
      legend={shouldShowLegend}
      shape="bubble"
      zAxisDataKey={props.zAxisDataKey ?? "z"}
      zAxisRange={props.zAxisRange ?? [160, 1600]}
    />
  );
};
