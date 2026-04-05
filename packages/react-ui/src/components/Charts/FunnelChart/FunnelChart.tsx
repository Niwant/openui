import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Cell, Funnel, LabelList, FunnelChart as RechartsFunnelChart } from "recharts";
import { usePrintContext } from "../../../context/PrintContext";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../Charts";
import { useExportChartData, useTransformedKeys } from "../hooks";
import { DefaultLegend } from "../shared";
import { LegendItem } from "../types";
import { getCategoricalChartConfig } from "../utils/dataUtils";
import { PaletteName, useChartPalette } from "../utils/PalletUtils";

export type FunnelChartData = Array<Record<string, string | number>>;

export interface FunnelChartProps<T extends FunnelChartData> {
  data: T;
  categoryKey: keyof T[number];
  dataKey: keyof T[number];
  theme?: PaletteName;
  customPalette?: string[];
  format?: "number" | "percentage";
  legend?: boolean;
  isAnimationActive?: boolean;
  className?: string;
  height?: number | string;
  width?: number | string;
}

const CHART_HEIGHT = 340;

const FunnelChartComponent = <T extends FunnelChartData>({
  data,
  categoryKey,
  dataKey,
  theme = "ocean",
  customPalette,
  format = "number",
  legend = true,
  isAnimationActive = false,
  className,
  height = CHART_HEIGHT,
  width,
}: FunnelChartProps<T>) => {
  const printContext = usePrintContext();
  isAnimationActive = printContext ? false : isAnimationActive;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);

  const sortedData = useMemo(
    () => [...data].sort((a, b) => Number(b[dataKey]) - Number(a[dataKey])),
    [data, dataKey],
  );

  const categories = useMemo(
    () => sortedData.map((item) => String(item[categoryKey])),
    [sortedData, categoryKey],
  );
  const transformedKeys = useTransformedKeys(categories);

  const total = useMemo(
    () => sortedData.reduce((sum, item) => sum + Number(item[dataKey] ?? 0), 0),
    [sortedData, dataKey],
  );

  const colors = useChartPalette({
    chartThemeName: theme,
    customPalette,
    themePaletteName: "pieChartPalette",
    dataLength: sortedData.length,
  });

  const processedData = useMemo(
    () =>
      sortedData.map((item, index) => {
        const value = Number(item[dataKey] ?? 0);
        return {
          ...item,
          fill: colors[index] ?? colors[0] ?? "#2563eb",
          percentage: total > 0 ? Number(((value / total) * 100).toFixed(2)) : 0,
        };
      }),
    [sortedData, dataKey, total, colors],
  );

  const chartConfig: ChartConfig = useMemo(
    () => getCategoricalChartConfig(sortedData as T, categoryKey, colors, transformedKeys),
    [sortedData, categoryKey, colors, transformedKeys],
  );

  const legendItems = useMemo<LegendItem[]>(() => {
    return processedData.map((item, index) => ({
      key: String(item[categoryKey]),
      label: String(item[categoryKey]),
      color: colors[index] ?? "#000000",
    }));
  }, [processedData, categoryKey, colors]);

  const exportData = useExportChartData({
    type: "funnel",
    data: sortedData,
    categoryKey: categoryKey as string,
    dataKeys: [dataKey as string],
    colors,
    legend,
  });

  useEffect(() => {
    if (width || !wrapperRef.current) {
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === wrapperRef.current) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(wrapperRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [width]);

  useEffect(() => {
    setIsLegendExpanded(false);
  }, [categories]);

  const effectiveWidth = width ?? containerWidth;
  const categoryKeyString = String(categoryKey);
  const dataKeyString = String(dataKey);
  const formatKey = format === "percentage" ? "percentage" : dataKeyString;

  return (
    <div
      className={clsx("openui-line-chart-condensed-container", className)}
      data-openui-chart={exportData}
      style={{ width: typeof width === "number" ? `${width}px` : width }}
      ref={wrapperRef}
    >
      <div className="openui-line-chart-condensed-container-inner">
        <div className="openui-line-chart-condensed" style={{ width: "100%" }}>
          <ChartContainer
            config={chartConfig}
            style={{ width: "100%", height }}
            rechartsProps={{ width: "100%", height: "100%" }}
          >
            <RechartsFunnelChart>
              <Funnel
                data={processedData}
                dataKey={formatKey}
                nameKey={categoryKeyString}
                isAnimationActive={isAnimationActive}
                stroke="#fff"
              >
                {processedData.map((_entry, index) => (
                  <Cell key={`funnel-cell-${index}`} fill={colors[index] ?? "#2563eb"} />
                ))}
                <LabelList
                  position="right"
                  fill="var(--openui-text-primary, #18181b)"
                  stroke="none"
                  dataKey={categoryKeyString}
                  formatter={(value: string) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      nameKey={categoryKeyString}
                      showPercentage={format === "percentage"}
                    />
                  }
                />
              </Funnel>
            </RechartsFunnelChart>
          </ChartContainer>
        </div>
      </div>
      {legend && (
        <DefaultLegend
          items={legendItems}
          containerWidth={typeof effectiveWidth === "number" ? effectiveWidth : 0}
          isExpanded={isLegendExpanded}
          setIsExpanded={setIsLegendExpanded}
        />
      )}
    </div>
  );
};

export const FunnelChart = React.memo(FunnelChartComponent) as typeof FunnelChartComponent;
