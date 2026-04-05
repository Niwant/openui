import type { Meta, StoryObj } from "@storybook/react";
import { BubbleChart } from "../BubbleChart";

const basicData = [
  {
    name: "Series A",
    data: [
      { name: "A", x: 10, y: 20, z: 30 },
      { name: "B", x: 20, y: 40, z: 50 },
      { name: "C", x: 30, y: 30, z: 40 },
      { name: "D", x: 40, y: 60, z: 70 },
      { name: "E", x: 50, y: 50, z: 60 },
    ],
  },
];

const multiSeriesData = [
  {
    name: "Product A",
    data: [
      { x: 10, y: 30, z: 40 },
      { x: 20, y: 50, z: 60 },
      { x: 30, y: 40, z: 50 },
      { x: 40, y: 70, z: 80 },
      { x: 50, y: 60, z: 70 },
    ],
  },
  {
    name: "Product B",
    data: [
      { x: 15, y: 25, z: 35 },
      { x: 25, y: 45, z: 55 },
      { x: 35, y: 55, z: 65 },
      { x: 45, y: 35, z: 45 },
      { x: 55, y: 65, z: 75 },
    ],
  },
];

const largeDataset = [
  {
    name: "Items",
    data: Array.from({ length: 20 }, (_, i) => ({
      id: `Item ${i + 1}`,
      x: Math.round(Math.random() * 100),
      y: Math.round(Math.random() * 100),
      z: Math.round(Math.random() * 100),
    })),
  },
];

const meta: Meta<typeof BubbleChart> = {
  title: "Components/Charts/BubbleChart",
  component: BubbleChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Installation and Basic Usage

\`\`\`tsx
import { BubbleChart } from '@openui-ui/react-ui/Charts/BubbleChart';

<BubbleChart
  data={data}
  xAxisDataKey="x"
  yAxisDataKey="y"
  zAxisDataKey="z"
  theme="ocean"
/>
\`\`\`

## Data Structure Requirements

Your data should be an array of objects where each object contains:
- An **x field** (number): Horizontal position
- A **y field** (number): Vertical position
- A **z field** (number): Bubble size (required)
- Optional **series field** (string): For grouping bubbles into series

\`\`\`tsx
const data = [
  { name: "A", x: 10, y: 20, z: 30 },
  { name: "B", x: 20, y: 40, z: 50 }
];
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | Array<Record<string, string \| number>> | required | Chart data |
| xAxisDataKey | string | "x" | Key for x-axis values |
| yAxisDataKey | string | "y" | Key for y-axis values |
| zAxisDataKey | string | "z" | Key for bubble size |
| seriesKey | string | "series" | Key for series grouping |
| theme | PaletteName | "ocean" | Color theme |
| legend | boolean | true | Show/hide legend |
| grid | boolean | true | Show/hide grid lines |
| isAnimationActive | boolean | false | Enable animations |
| xAxisLabel | ReactNode | - | X-axis label |
| yAxisLabel | ReactNode | - | Y-axis label |
`,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["ocean", "orchid", "emerald", "spectrum", "sunset", "vivid"],
    },
    legend: {
      control: { type: "boolean" },
    },
    grid: {
      control: { type: "boolean" },
    },
    isAnimationActive: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BubbleChart>;

export const Basic: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
  },
};

export const OceanTheme: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    theme: "ocean",
  },
};

export const OrchidTheme: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    theme: "orchid",
  },
};

export const EmeraldTheme: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    theme: "emerald",
  },
};

export const SpectrumTheme: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    theme: "spectrum",
  },
};

export const SunsetTheme: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    theme: "sunset",
  },
};

export const VividTheme: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    theme: "vivid",
  },
};

export const WithLegend: Story = {
  args: {
    data: multiSeriesData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    legend: true,
  },
};

export const WithoutLegend: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    legend: false,
  },
};

export const WithGrid: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    grid: true,
  },
};

export const WithoutGrid: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    grid: false,
  },
};

export const WithAnimation: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    isAnimationActive: true,
  },
};

export const WithAxisLabels: Story = {
  args: {
    data: basicData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    xAxisLabel: "Revenue ($K)",
    yAxisLabel: "Growth (%)",
  },
};

export const LargeDataset: Story = {
  args: {
    data: largeDataset,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
  },
};

export const MultiSeries: Story = {
  args: {
    data: multiSeriesData,
    xAxisDataKey: "x",
    yAxisDataKey: "y",
    zAxisDataKey: "z",
    legend: true,
  },
};
