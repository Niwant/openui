import type { Meta, StoryObj } from "@storybook/react";
import { FunnelChart } from "../FunnelChart";

const basicData = [
  { stage: "Website Visits", value: 15000 },
  { stage: "Sign Ups", value: 8000 },
  { stage: "Activated", value: 5000 },
  { stage: "Purchased", value: 3000 },
  { stage: "Retained", value: 1500 },
];

const salesPipelineData = [
  { stage: "Leads", value: 500 },
  { stage: "Qualified", value: 320 },
  { stage: "Proposal", value: 180 },
  { stage: "Negotiation", value: 95 },
  { stage: "Closed Won", value: 62 },
];

const recruitmentData = [
  { stage: "Applications", value: 1200 },
  { stage: "Screening", value: 450 },
  { stage: "Interviews", value: 180 },
  { stage: "Offers", value: 45 },
  { stage: "Hired", value: 38 },
];

const meta: Meta<typeof FunnelChart> = {
  title: "Components/Charts/FunnelChart",
  component: FunnelChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Installation and Basic Usage

\`\`\`tsx
import { FunnelChart } from '@openui-ui/react-ui/Charts/FunnelChart';

<FunnelChart
  data={data}
  categoryKey="stage"
  dataKey="value"
  theme="ocean"
/>
\`\`\`

## Data Structure Requirements

Your data should be an array of objects where each object contains:
- A **category field** (string): Stage name for labels
- A **value field** (number): Used to determine funnel section sizes

\`\`\`tsx
const data = [
  { stage: "Website Visits", value: 15000 },
  { stage: "Sign Ups", value: 8000 }
];
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | Array<Record<string, string \| number>> | required | Chart data |
| categoryKey | string | required | Key for stage labels |
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
type Story = StoryObj<typeof FunnelChart>;

export const Basic: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
  },
};

export const OceanTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    theme: "ocean",
  },
};

export const OrchidTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    theme: "orchid",
  },
};

export const EmeraldTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    theme: "emerald",
  },
};

export const SpectrumTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    theme: "spectrum",
  },
};

export const SunsetTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    theme: "sunset",
  },
};

export const VividTheme: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    theme: "vivid",
  },
};

export const WithLegend: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    legend: true,
  },
};

export const WithoutLegend: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    legend: false,
  },
};

export const WithAnimation: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    isAnimationActive: true,
  },
};

export const PercentageFormat: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    format: "percentage",
  },
};

export const NumberFormat: Story = {
  args: {
    data: basicData,
    categoryKey: "stage",
    dataKey: "value",
    format: "number",
  },
};

export const SalesPipeline: Story = {
  args: {
    data: salesPipelineData,
    categoryKey: "stage",
    dataKey: "value",
    theme: "emerald",
    format: "percentage",
  },
};

export const RecruitmentFunnel: Story = {
  args: {
    data: recruitmentData,
    categoryKey: "stage",
    dataKey: "value",
    theme: "orchid",
    format: "percentage",
  },
};
