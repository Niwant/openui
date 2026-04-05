import type { Meta, StoryObj } from "@storybook/react";
import { TreemapChart } from "../TreemapChart";

const basicData = [
  { category: "Electronics", value: 4500 },
  { category: "Apparel", value: 3200 },
  { category: "Groceries", value: 6800 },
  { category: "Home", value: 2100 },
  { category: "Books", value: 1500 },
];

const largeData = [
  { category: "Electronics", value: 12500 },
  { category: "Apparel", value: 9800 },
  { category: "Groceries", value: 14500 },
  { category: "Home Goods", value: 13200 },
  { category: "Books", value: 8800 },
  { category: "Toys", value: 7600 },
  { category: "Automotive", value: 6500 },
  { category: "Health", value: 11200 },
  { category: "Beauty", value: 9300 },
  { category: "Sports", value: 8100 },
  { category: "Outdoors", value: 7200 },
  { category: "Music", value: 4500 },
  { category: "Software", value: 10500 },
];

const marketShareData = [
  { category: "Company A", value: 35 },
  { category: "Company B", value: 25 },
  { category: "Company C", value: 18 },
  { category: "Company D", value: 12 },
  { category: "Company E", value: 7 },
  { category: "Others", value: 3 },
];

const meta: Meta<typeof TreemapChart> = {
  title: "Components/Charts/TreemapChart",
  component: TreemapChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Installation and Basic Usage

\`\`\`tsx
import { TreemapChart } from '@openui-ui/react-ui/Charts/TreemapChart';

<TreemapChart
  data={data}
  categoryKey="category"
  dataKey="value"
  theme="ocean"
/>
\`\`\`

## Data Structure Requirements

Your data should be an array of objects where each object contains:
- A **category field** (string): Used for labels and legend items
- A **value field** (number): Used to determine rectangle sizes

\`\`\`tsx
const data = [
  { category: "Electronics", value: 4500 },
  { category: "Apparel", value: 3200 }
];
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | Array<Record<string, string \| number>> | required | Chart data |
| categoryKey | string | required | Key for category labels |
| dataKey | string | required | Key for values |
| theme | PaletteName | "ocean" | Color theme |
| format | "number" \| "percentage" | "number" | Value format |
| legend | boolean | true | Show/hide legend |
| isAnimationActive | boolean | false | Enable animations |
`,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["ocean", "orchid", "emerald", "spectrum", "sunset", "vivid"],
    },
    format: {
      control: { type: "select" },
      options: ["number", "percentage"],
    },
    legend: {
      control: { type: "boolean" },
    },
    isAnimationActive: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TreemapChart>;

export const Basic: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
  },
};

export const OceanTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    theme: "ocean",
  },
};

export const OrchidTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    theme: "orchid",
  },
};

export const EmeraldTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    theme: "emerald",
  },
};

export const SpectrumTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    theme: "spectrum",
  },
};

export const SunsetTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    theme: "sunset",
  },
};

export const VividTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    theme: "vivid",
  },
};

export const WithLegend: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    legend: true,
  },
};

export const WithoutLegend: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    legend: false,
  },
};

export const WithAnimation: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    isAnimationActive: true,
  },
};

export const PercentageFormat: Story = {
  args: {
    data: marketShareData,
    categoryKey: "category",
    dataKey: "value",
    format: "percentage",
  },
};

export const NumberFormat: Story = {
  args: {
    data: basicData,
    categoryKey: "category",
    dataKey: "value",
    format: "number",
  },
};

export const LargeDataset: Story = {
  args: {
    data: largeData,
    categoryKey: "category",
    dataKey: "value",
  },
};

export const MarketShare: Story = {
  args: {
    data: marketShareData,
    categoryKey: "category",
    dataKey: "value",
    format: "percentage",
    theme: "spectrum",
  },
};
