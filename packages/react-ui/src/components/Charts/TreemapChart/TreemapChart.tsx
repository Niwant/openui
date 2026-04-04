import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Treemap } from "recharts";
import { usePrintContext } from "../../../context/PrintContext";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../Charts";
import { useExportChartData, useTransformedKeys } from "../hooks";
import { DefaultLegend } from "../shared";
import { LegendItem } from "../types";
import { getCategoricalChartConfig } from "../utils/dataUtils";
import { PaletteName, useChartPalette } from "../utils/PalletUtils";

export type TreemapChartData = Array<Record<string, string | number>>;

export interface TreemapChartProps<T extends TreemapChartData> {
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

type TreemapDatum = Record<string, string | number> & {
  fill: string;
  percentage: number;
};

const CHART_HEIGHT = 340;

function getTextColor(fill: string) {
  const normalized = fill.replace("#", "");
  if (normalized.length !== 6) {
    return "rgba(255, 255, 255, 0.96)";
  }

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? "rgba(24, 24, 27, 0.92)" : "rgba(255, 255, 255, 0.96)";
}

function truncateLabel(label: string, maxLength: number) {
  if (label.length <= maxLength) {
    return label;
  }

  return `${label.slice(0, Math.max(0, maxLength - 1))}...`;
}

function formatTreemapValue(value: number, format: "number" | "percentage") {
  if (format === "percentage") {
    return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
  }

  return value.toLocaleString();
}

type TreemapNodeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  depth?: number;
} & Partial<TreemapDatum>;

function TreemapNode({
  format,
  categoryKey,
  dataKey,
  ...node
}: TreemapNodeProps & {
  format: "number" | "percentage";
  categoryKey: string;
  dataKey: string;
}) {
  const { x = 0, y = 0, width = 0, height = 0, fill = "#2563eb", depth = 0 } = node;

  if (depth < 1 || width < 2 || height < 2) {
    return null;
  }

  const label = String(node[categoryKey] ?? "");
  const displayValue = Number(node[format === "percentage" ? "percentage" : dataKey] ?? 0);
  const textColor = getTextColor(fill);
  const canRenderValue = width > 88 && height > 56;
  const maxLabelLength = width > 150 ? 20 : width > 100 ? 14 : 10;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        ry={8}
        fill={fill}
        stroke="rgba(255, 255, 255, 0.22)"
        strokeWidth={1}
      />
      {width > 60 && height > 30 && (
        <text x={x + 10} y={y + 18} fill={textColor} fontSize={12} fontWeight={600}>
          {truncateLabel(label, maxLabelLength)}
        </text>
      )}
      {canRenderValue && (
        <text x={x + 10} y={y + 36} fill={textColor} fontSize={12} opacity={0.88}>
          {formatTreemapValue(displayValue, format)}
        </text>
      )}
    </g>
  );
}

const TreemapChartComponent = <T extends TreemapChartData>({
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
}: TreemapChartProps<T>) => {
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

  const colors = useChartPalette({
    chartThemeName: theme,
    customPalette,
    themePaletteName: "pieChartPalette",
    dataLength: sortedData.length,
  });

  const total = useMemo(
    () => sortedData.reduce((sum, item) => sum + Number(item[dataKey] ?? 0), 0),
    [sortedData, dataKey],
  );

  const processedData = useMemo<TreemapDatum[]>(() => {
    return sortedData.map((item, index) => {
      const value = Number(item[dataKey] ?? 0);
      return {
        ...item,
        fill: colors[index] ?? colors[0] ?? "#2563eb",
        percentage: total > 0 ? Number(((value / total) * 100).toFixed(2)) : 0,
      };
    });
  }, [sortedData, dataKey, colors, total]);

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
    type: "treemap",
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
  const effectiveDataKey = format === "percentage" ? "percentage" : (dataKey as string);
  const categoryKeyString = String(categoryKey);

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
            <Treemap
              data={processedData}
              dataKey={effectiveDataKey}
              nameKey={categoryKeyString}
              isAnimationActive={isAnimationActive}
              stroke="rgba(255,255,255,0.16)"
              content={
                <TreemapNode
                  format={format}
                  categoryKey={categoryKeyString}
                  dataKey={String(dataKey)}
                />
              }
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent showPercentage={format === "percentage"} />}
              />
            </Treemap>
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

export const TreemapChart = React.memo(TreemapChartComponent) as typeof TreemapChartComponent;
