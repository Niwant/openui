import clsx from "clsx";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Bar, Line, ComposedChart as RechartsComposedChart, XAxis, YAxis } from "recharts";
import { usePrintContext } from "../../../context/PrintContext";
import { ChartConfig, ChartContainer, ChartTooltip } from "../Charts";
import { DEFAULT_X_AXIS_HEIGHT, X_AXIS_PADDING } from "../constants";
import { SideBarChartData, SideBarTooltipProvider } from "../context/SideBarTooltipContext";
import {
  useAutoAngleCalculation,
  useExportChartData,
  useMaxLabelWidth,
  useTransformedKeys,
  useYAxisLabelWidth,
} from "../hooks";
import {
  ActiveDot,
  cartesianGrid,
  CustomTooltipContent,
  DefaultLegend,
  SVGXAxisTick,
  YAxisTick,
} from "../shared";
import { LegendItem } from "../types";
import { get2dChartConfig, getDataKeys, getLegendItems } from "../utils/dataUtils";
import { PaletteName, useChartPalette } from "../utils/PalletUtils";

export type ComboSeriesKind = "bar" | "line";
export type ComboChartData = Array<Record<string, string | number>>;

export interface ComboChartProps<T extends ComboChartData> {
  data: T;
  categoryKey: keyof T[number];
  seriesKinds: Record<string, ComboSeriesKind>;
  theme?: PaletteName;
  customPalette?: string[];
  grid?: boolean;
  isAnimationActive?: boolean;
  showYAxis?: boolean;
  xAxisLabel?: React.ReactNode;
  yAxisLabel?: React.ReactNode;
  legend?: boolean;
  className?: string;
  height?: number;
  width?: number;
  strokeWidth?: number;
  barSize?: number;
}

const CHART_HEIGHT = 296;

const ComboChartComponent = <T extends ComboChartData>({
  data,
  categoryKey,
  seriesKinds,
  theme = "ocean",
  customPalette,
  grid = true,
  isAnimationActive = false,
  showYAxis = true,
  xAxisLabel,
  yAxisLabel,
  legend = true,
  className,
  height = CHART_HEIGHT,
  width,
  strokeWidth = 3,
  barSize = 28,
}: ComboChartProps<T>) => {
  const printContext = usePrintContext();
  isAnimationActive = printContext ? false : isAnimationActive;

  const dataKeys = useMemo(() => getDataKeys(data, categoryKey as string), [data, categoryKey]);
  const { yAxisWidth, setLabelWidth } = useYAxisLabelWidth(data, dataKeys);
  const maxLabelWidth = useMaxLabelWidth(data, categoryKey as string);
  const transformedKeys = useTransformedKeys(dataKeys);

  const colors = useChartPalette({
    chartThemeName: theme,
    customPalette,
    themePaletteName: "barChartPalette",
    dataLength: dataKeys.length,
  });

  const chartConfig: ChartConfig = useMemo(() => {
    return get2dChartConfig(dataKeys, colors, transformedKeys);
  }, [dataKeys, colors, transformedKeys]);

  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isSideBarTooltipOpen, setIsSideBarTooltipOpen] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const [sideBarTooltipData, setSideBarTooltipData] = useState<SideBarChartData>({
    title: "",
    values: [],
  });

  const widthOfData = useMemo(() => {
    if (data.length === 0) {
      return 0;
    }

    const chartWidth = width ?? containerWidth;
    return chartWidth / data.length;
  }, [width, containerWidth, data]);

  const { angle: calculatedAngle, height: xAxisHeight } = useAutoAngleCalculation(
    maxLabelWidth,
    true,
    maxLabelWidth < 100 ? widthOfData : undefined,
  );

  const effectiveHeight = useMemo(() => {
    return height + DEFAULT_X_AXIS_HEIGHT + xAxisHeight;
  }, [height, xAxisHeight]);

  const effectiveWidth = useMemo(() => width ?? containerWidth, [width, containerWidth]);

  useEffect(() => {
    if (width || !containerRef.current) {
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [width]);

  useEffect(() => {
    setIsLegendExpanded(false);
  }, [dataKeys]);

  const legendItems: LegendItem[] = useMemo(() => {
    if (!legend) {
      return [];
    }

    return getLegendItems(dataKeys, colors);
  }, [colors, dataKeys, legend]);

  const exportData = useExportChartData({
    type: "bar",
    data,
    categoryKey: categoryKey as string,
    dataKeys,
    colors,
    legend,
    xAxisLabel,
    yAxisLabel,
  });

  return (
    <SideBarTooltipProvider
      isSideBarTooltipOpen={isSideBarTooltipOpen}
      setIsSideBarTooltipOpen={setIsSideBarTooltipOpen}
      data={sideBarTooltipData}
      setData={setSideBarTooltipData}
    >
      <div
        className={clsx("openui-line-chart-condensed-container", className)}
        data-openui-chart={exportData}
        style={{ width: width ? `${width}px` : undefined }}
      >
        {yAxisLabel && <div className="openui-line-chart-condensed-y-axis-label">{yAxisLabel}</div>}
        <div className="openui-line-chart-condensed-container-inner" ref={containerRef}>
          <div className="openui-line-chart-condensed" style={{ width: "100%" }}>
            <ChartContainer
              config={chartConfig}
              style={{ width: "100%", height: effectiveHeight }}
              rechartsProps={{ width: "100%", height: "100%" }}
            >
              <RechartsComposedChart
                accessibilityLayer
                key={`combo-chart-${id}`}
                data={data}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                {grid && cartesianGrid()}

                <XAxis
                  dataKey={categoryKey as string}
                  tickLine={false}
                  axisLine={false}
                  textAnchor={calculatedAngle !== 0 ? "end" : "middle"}
                  interval="preserveStartEnd"
                  minTickGap={5}
                  height={xAxisHeight}
                  tick={<SVGXAxisTick />}
                  angle={calculatedAngle}
                  orientation="bottom"
                  padding={{ left: X_AXIS_PADDING, right: X_AXIS_PADDING }}
                />

                {showYAxis && (
                  <YAxis
                    width={yAxisWidth}
                    tickLine={false}
                    axisLine={false}
                    tick={<YAxisTick setLabelWidth={setLabelWidth} />}
                  />
                )}

                <ChartTooltip
                  content={<CustomTooltipContent parentRef={containerRef} />}
                  offset={10}
                />

                {dataKeys.map((key) => {
                  const transformedKey = transformedKeys[key];
                  const color = `var(--color-${transformedKey})`;
                  const kind = seriesKinds[key] ?? "bar";

                  if (kind === "line") {
                    return (
                      <Line
                        key={`combo-line-${key}`}
                        dataKey={key}
                        type="natural"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        dot={false}
                        activeDot={<ActiveDot key={`combo-active-dot-${key}-${id}`} />}
                        isAnimationActive={isAnimationActive}
                      />
                    );
                  }

                  return (
                    <Bar
                      key={`combo-bar-${key}`}
                      dataKey={key}
                      fill={color}
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={isAnimationActive}
                      barSize={barSize}
                    />
                  );
                })}
              </RechartsComposedChart>
            </ChartContainer>
          </div>
        </div>
        {xAxisLabel && <div className="openui-line-chart-condensed-x-axis-label">{xAxisLabel}</div>}
        {legend && (
          <DefaultLegend
            items={legendItems}
            containerWidth={effectiveWidth}
            isExpanded={isLegendExpanded}
            setIsExpanded={setIsLegendExpanded}
          />
        )}
      </div>
    </SideBarTooltipProvider>
  );
};

export const ComboChart = React.memo(ComboChartComponent) as typeof ComboChartComponent;
