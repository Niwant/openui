import type { Meta, StoryObj } from "@storybook/react";
import { ComboChart } from "../ComboChart";

const basicData = [
  { month: "Jan", revenue: 4000, target: 3500 },
  { month: "Feb", revenue: 3000, target: 3200 },
  { month: "Mar", revenue: 5000, target: 4000 },
  { month: "Apr", revenue: 4500, target: 4200 },
  { month: "May", revenue: 6000, target: 5000 },
  { month: "Jun", revenue: 5500, target: 5200 },
];

const multiSeriesData = [
  { month: "Q1", sales: 12000, margin: 3200, growth: 15 },
  { month: "Q2", sales: 15000, margin: 4100, growth: 22 },
  { month: "Q3", sales: 18000, margin: 5300, growth: 28 },
  { month: "Q4", sales: 21000, margin: 6200, growth: 35 },
];

const trendData = [
  { month: "Jan", users: 1200, satisfaction: 85, retention: 92 },
  { month: "Feb", users: 1500, satisfaction: 88, retention: 90 },
  { month: "Mar", users: 1800, satisfaction: 82, retention: 88 },
  { month: "Apr", users: 2200, satisfaction: 90, retention: 91 },
  { month: "May", users: 2800, satisfaction: 93, retention: 94 },
  { month: "Jun", users: 3200, satisfaction: 91, retention: 93 },
];

const meta: Meta<typeof ComboChart> = {
  title: "Components/Charts/ComboChart",
  component: ComboChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Installation and Basic Usage

\`\`\`tsx
import { ComboChart } from '@openui-ui/react-ui/Charts/ComboChart';

<ComboChart
  data={data}
  categoryKey="month"
  seriesKinds={{ revenue: "bar", target: "line" }}
  theme="ocean"
/>
\`\`\`

## Data Structure Requirements

Your data should be an array of objects where each object contains:
- A **category field** (string): Used for x-axis labels
- **Value fields** (number): One per series to display
- **seriesKinds**: Map each series key to "bar" or "line"

\`\`\`tsx
const data = [
  { month: "Jan", revenue: 4000, target: 3500 },
  { month: "Feb", revenue: 3000, target: 3200 }
];
const seriesKinds = { revenue: "bar", target: "line" };
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | Array<Record<string, string \| number>> | required | Chart data |
| categoryKey | string | required | Key for category labels |
| seriesKinds | Record<string, "bar" \| "line"> | required | Series type mapping |
| theme | PaletteName | "ocean" | Color theme |
| legend | boolean | true | Show/hide legend |
| grid | boolean | true | Show/hide grid lines |
| isAnimationActive | boolean | false | Enable animations |
| xAxisLabel | ReactNode | - | X-axis label |
| yAxisLabel | ReactNode | - | Y-axis label |
| strokeWidth | number | 3 | Line stroke width |
| barSize | number | 28 | Bar width |
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
    strokeWidth: {
      control: { type: "range", min: 1, max: 6, step: 1 },
    },
    barSize: {
      control: { type: "range", min: 10, max: 60, step: 2 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComboChart>;

export const Basic: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
  },
};

export const OceanTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    theme: "ocean",
  },
};

export const OrchidTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    theme: "orchid",
  },
};

export const EmeraldTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    theme: "emerald",
  },
};

export const SpectrumTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    theme: "spectrum",
  },
};

export const SunsetTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    theme: "sunset",
  },
};

export const VividTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    theme: "vivid",
  },
};

export const WithLegend: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    legend: true,
  },
};

export const WithoutLegend: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    legend: false,
  },
};

export const WithGrid: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    grid: true,
  },
};

export const WithoutGrid: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    grid: false,
  },
};

export const WithAnimation: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    isAnimationActive: true,
  },
};

export const WithAxisLabels: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    xAxisLabel: "Month",
    yAxisLabel: "Amount ($)",
  },
};

export const MultiSeries: Story = {
  args: {
    data: multiSeriesData,
    categoryKey: "month",
    seriesKinds: { sales: "bar", margin: "bar", growth: "line" },
  },
};

export const TrendAnalysis: Story = {
  args: {
    data: trendData,
    categoryKey: "month",
    seriesKinds: { users: "bar", satisfaction: "line", retention: "line" },
    xAxisLabel: "Month",
    yAxisLabel: "Value",
  },
};

export const ThickLines: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    strokeWidth: 5,
  },
};

export const WideBars: Story = {
  args: {
    data: basicData,
    categoryKey: "month",
    seriesKinds: { revenue: "bar", target: "line" },
    barSize: 40,
  },
};
