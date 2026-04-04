"use client";

import type { ComponentGroup, PromptOptions } from "@openuidev/react-lang";
import { createLibrary } from "@openuidev/react-lang";

// Content
import { Callout } from "./Callout";
import { Card } from "./Card";
import { CardHeader } from "./CardHeader";
import { CodeBlock } from "./CodeBlock";
import { Image } from "./Image";
import { ImageBlock } from "./ImageBlock";
import { ImageGallery } from "./ImageGallery";
import { MarkDownRenderer } from "./MarkDownRenderer";
import { TextCallout } from "./TextCallout";
import { TextContent } from "./TextContent";

// Charts
import {
  AreaChartCondensed,
  BarChartCondensed,
  BubbleChart,
  BubblePoint,
  BubbleSeries,
  ComboChart,
  ComboSeries,
  HorizontalBarChart,
  LineChartCondensed,
  PieChart,
  Point,
  RadarChart,
  RadialChart,
  ScatterChart,
  ScatterSeries,
  Series,
  SingleStackedBarChart,
  Slice,
  TreemapChart,
  TreemapItem,
} from "./Charts";

// Forms
import { CheckBoxGroup, CheckBoxItem } from "./CheckBoxGroup";
import { DatePicker } from "./DatePicker";
import { Form } from "./Form";
import { FormControl } from "./FormControl";
import { Input } from "./Input";
import { Label } from "./Label";
import { RadioGroup, RadioItem } from "./RadioGroup";
import { Select, SelectItem } from "./Select";
import { Slider } from "./Slider";
import { SwitchGroup, SwitchItem } from "./SwitchGroup";
import { TextArea } from "./TextArea";

// Buttons
import { Button } from "./Button";
import { Buttons } from "./Buttons";

// Layout
import { Accordion, AccordionItem } from "./Accordion";
import { Carousel } from "./Carousel";
import { Separator } from "./Separator";
import { Stack } from "./Stack";
import { Steps, StepsItem } from "./Steps";
import { TabItem, Tabs } from "./Tabs";

// Data Display
import { Col, Table } from "./Table";
import { Tag } from "./Tag";
import { TagBlock } from "./TagBlock";

// ── Component Groups ──

export const openuiComponentGroups: ComponentGroup[] = [
  {
    name: "Layout",
    components: [
      "Stack",
      "Tabs",
      "TabItem",
      "Accordion",
      "AccordionItem",
      "Steps",
      "StepsItem",
      "Carousel",
      "Separator",
    ],
    notes: [
      '- For grid-like layouts, use Stack with direction "row" and wrap set to true.',
      '- Prefer justify "start" (or omit justify) with wrap=true for stable columns instead of uneven gutters.',
      "- Use nested Stacks when you need explicit rows/sections.",
    ],
  },
  {
    name: "Content",
    components: [
      "Card",
      "CardHeader",
      "TextContent",
      "MarkDownRenderer",
      "Callout",
      "TextCallout",
      "Image",
      "ImageBlock",
      "ImageGallery",
      "CodeBlock",
    ],
  },
  {
    name: "Tables",
    components: ["Table", "Col"],
  },
  {
    name: "Charts (2D)",
    components: [
      "BarChart",
      "LineChart",
      "AreaChart",
      "RadarChart",
      "HorizontalBarChart",
      "ComboChart",
      "Series",
      "ComboSeries",
    ],
    notes: [
      "- BarChart, LineChart, AreaChart, and HorizontalBarChart keep their original required args first: labels, series, then optional variant.",
      "- ComboChart takes labels and ComboSeries first, then optional theme, legend, animated, showGrid, xLabel, and yLabel.",
      "- After the required args, you can optionally set theme, legend, animated, showGrid, xLabel, and yLabel.",
      "- RadarChart takes labels and series first, then optional theme, legend, animated, and showGrid.",
      "- Keep every Series values array the same length as labels.",
      "- Use ComboSeries with type=bar for columns and type=line for overlays like targets or trends.",
      "- Use animated=true only when the user explicitly asks for animation or motion.",
    ],
  },
  {
    name: "Charts (1D)",
    components: [
      "PieChart",
      "RadialChart",
      "SingleStackedBarChart",
      "TreemapChart",
      "Slice",
      "TreemapItem",
    ],
    notes: [
      '- PieChart takes slices first, then optional variant, theme, legend, animated, and format. Use format="percentage" for part-to-whole percentages.',
      "- RadialChart takes slices first, then optional theme, legend, animated, format, and showGrid.",
      "- SingleStackedBarChart takes slices first, then optional theme, legend, and animated.",
      "- TreemapChart takes items first, then optional theme, legend, animated, and format. Use it when you need many categories shown as proportional rectangles.",
    ],
  },
  {
    name: "Charts (Scatter)",
    components: [
      "ScatterChart",
      "ScatterSeries",
      "Point",
      "BubbleChart",
      "BubbleSeries",
      "BubblePoint",
    ],
    notes: [
      "- ScatterChart takes datasets first, then optional theme, legend, animated, showGrid, xLabel, and yLabel.",
      "- Use Point(x, y, z?) and include z only when point size should encode a third metric.",
      "- Use BubbleChart when a third numeric metric should control bubble size. BubbleChart takes datasets first, then optional theme, legend, animated, showGrid, xLabel, and yLabel.",
      "- BubbleSeries uses BubblePoint(x, y, z), where z is required and controls bubble size.",
    ],
  },
  {
    name: "Forms",
    components: [
      "Form",
      "FormControl",
      "Label",
      "Input",
      "TextArea",
      "Select",
      "SelectItem",
      "DatePicker",
      "Slider",
      "CheckBoxGroup",
      "CheckBoxItem",
      "RadioGroup",
      "RadioItem",
      "SwitchGroup",
      "SwitchItem",
    ],
    notes: [
      "- For Form fields, define EACH FormControl as its own reference — do NOT inline all controls in one array. This allows progressive field-by-field streaming.",
      "- NEVER nest Form inside Form — each Form should be a standalone container.",
      "- Form requires explicit buttons. Always pass a Buttons(...) reference as the third Form argument.",
      '- rules is an optional array of validation strings: ["required", "email", "min:8", "maxLength:100"]',
      "- Available rules: required, email, min:N, max:N, minLength:N, maxLength:N, pattern:REGEX, url, numeric",
      "- The renderer shows error messages automatically — do NOT generate error text in the UI",
    ],
  },
  {
    name: "Buttons",
    components: ["Button", "Buttons"],
  },
  {
    name: "Data Display",
    components: ["TagBlock", "Tag"],
  },
];

// ── Examples ──

export const openuiExamples: string[] = [
  `Example 1 — Table:
root = Stack([title, tbl])
title = TextContent("Top Languages", "large-heavy")
tbl = Table(cols, rows)
cols = [Col("Language", "string"), Col("Users (M)", "number"), Col("Year", "number")]
rows = [["Python", 15.7, 1991], ["JavaScript", 14.2, 1995], ["Java", 12.1, 1995], ["TypeScript", 8.5, 2012], ["Go", 5.2, 2009]]`,

  `Example 2 — Bar chart with chart controls:
root = Stack([title, chart])
title = TextContent("Q4 Revenue", "large-heavy")
chart = BarChart(labels, [s1, s2], "grouped", "sunset", false, false, true, "Month", "Revenue ($K)")
labels = ["Oct", "Nov", "Dec"]
s1 = Series("Product A", [120, 150, 180])
s2 = Series("Product B", [90, 110, 140])`,

  `Example 3 — Donut chart with percentage formatting:
root = Stack([title, chart])
title = TextContent("Market Share", "large-heavy")
chart = PieChart(slices, "donut", "emerald", true, false, "percentage")
slices = [share1, share2, share3]
share1 = Slice("Alpha", 42)
share2 = Slice("Beta", 33)
share3 = Slice("Gamma", 25)`,

  `Example 4 — Bubble chart:
root = Stack([title, chart])
title = TextContent("Campaign Performance", "large-heavy")
chart = BubbleChart([north, south], "spectrum", true, false, true, "Spend ($K)", "Pipeline ($K)")
north = BubbleSeries("North", [n1, n2, n3])
south = BubbleSeries("South", [s1, s2, s3])
n1 = BubblePoint(25, 180, 40)
n2 = BubblePoint(40, 240, 65)
n3 = BubblePoint(55, 330, 90)
s1 = BubblePoint(20, 150, 35)
s2 = BubblePoint(35, 220, 55)
s3 = BubblePoint(50, 295, 80)`,

  `Example 5 — Combo chart:
root = Stack([title, chart])
title = TextContent("Revenue vs Target", "large-heavy")
chart = ComboChart(labels, [revenue, target], "orchid", true, false, true, "Month", "Revenue ($K)")
labels = ["Jan", "Feb", "Mar", "Apr"]
revenue = ComboSeries("Revenue", [120, 145, 168, 190], "bar")
target = ComboSeries("Target", [110, 140, 160, 185], "line")`,

  `Example 6 — Treemap chart:
root = Stack([title, chart])
title = TextContent("Portfolio Allocation", "large-heavy")
chart = TreemapChart(items, "vivid", true, false, "percentage")
items = [asset1, asset2, asset3, asset4, asset5]
asset1 = TreemapItem("Equities", 42)
asset2 = TreemapItem("Bonds", 24)
asset3 = TreemapItem("Real Estate", 16)
asset4 = TreemapItem("Cash", 10)
asset5 = TreemapItem("Alternatives", 8)`,

  `Example 7 — Form with validation:
root = Stack([title, form])
title = TextContent("Contact Us", "large-heavy")
form = Form("contact", btns, [nameField, emailField, countryField, msgField])
nameField = FormControl("Name", Input("name", "Your name", "text", { required: true, minLength: 2 }))
emailField = FormControl("Email", Input("email", "you@example.com", "email", { required: true, email: true }))
countryField = FormControl("Country", Select("country", countryOpts, "Select...", { required: true }))
msgField = FormControl("Message", TextArea("message", "Tell us more...", 4, { required: true, minLength: 10 }))
countryOpts = [SelectItem("us", "United States"), SelectItem("uk", "United Kingdom"), SelectItem("de", "Germany")]
btns = Buttons([Button("Submit", { type: "continue_conversation" }, "primary"), Button("Cancel", { type: "continue_conversation" }, "secondary")])`,

  `Example 8 — Tabs with mixed content:
root = Stack([title, tabs])
title = TextContent("React vs Vue", "large-heavy")
tabs = Tabs([tabReact, tabVue])
tabReact = TabItem("react", "React", reactContent)
tabVue = TabItem("vue", "Vue", vueContent)
reactContent = [TextContent("React is a library by Meta for building UIs."), Callout("info", "Note", "React uses JSX syntax.")]
vueContent = [TextContent("Vue is a progressive framework by Evan You."), Callout("success", "Tip", "Vue has a gentle learning curve.")]`,
];

export const openuiAdditionalRules: string[] = [
  'For grid-like layouts, use Stack with direction "row" and wrap=true. Avoid justify="between" unless you specifically want large gutters.',
  "For forms, define one FormControl reference per field so controls can stream progressively.",
  "For forms, always provide the second Form argument with Buttons(...) actions: Form(name, buttons, fields).",
  "Never nest Form inside Form.",
  "For charts, keep required data arguments first and add visual controls only after them.",
  'Use theme from: "ocean", "orchid", "emerald", "spectrum", "sunset", "vivid".',
  "Use legend=false only when the user asks to hide the legend or a single-series chart is cleaner without it.",
  "Use animated=true only when the user explicitly asks for animation or motion.",
  'Use format="percentage" for PieChart and RadialChart when the user asks for shares, composition, or percentages.',
  "If you set a later optional chart argument, use undefined placeholders to skip earlier optional args you do not need.",
  "For BarChart, LineChart, AreaChart, and HorizontalBarChart, every Series values array must match the labels length exactly.",
  "Use BubbleChart when x and y should position points and a third numeric metric should control bubble size.",
  "BubbleChart datasets must use BubbleSeries, and each BubblePoint must include x, y, and z.",
  "Use ComboChart when you need bars and lines in the same chart, such as actuals vs target or totals vs trend.",
  "ComboChart datasets must use ComboSeries, and each ComboSeries must set type to bar or line.",
  "Use TreemapChart when you need to compare many categories as area-sized rectangles instead of slices or bars.",
  "TreemapChart items must use TreemapItem(category, value).",
];

export const openuiPromptOptions: PromptOptions = {
  examples: openuiExamples,
  additionalRules: openuiAdditionalRules,
};

// ── Library ──

export const openuiLibrary = createLibrary({
  root: "Stack",
  componentGroups: openuiComponentGroups,
  components: [
    // Content
    Card,
    CardHeader,
    TextContent,
    MarkDownRenderer,
    Callout,
    TextCallout,
    Image,
    ImageBlock,
    ImageGallery,
    CodeBlock,
    // Tables
    Table,
    Col,
    // Charts (2D)
    BarChartCondensed,
    LineChartCondensed,
    AreaChartCondensed,
    RadarChart,
    HorizontalBarChart,
    ComboChart,
    Series,
    ComboSeries,
    // Charts (1D)
    PieChart,
    RadialChart,
    SingleStackedBarChart,
    Slice,
    TreemapChart,
    TreemapItem,
    // Charts (Scatter)
    ScatterChart,
    ScatterSeries,
    Point,
    BubbleChart,
    BubbleSeries,
    BubblePoint,

    // Forms
    Form,
    FormControl,
    Label,
    Input,
    TextArea,
    Select,
    SelectItem,
    DatePicker,
    Slider,
    CheckBoxGroup,
    CheckBoxItem,
    RadioGroup,
    RadioItem,
    SwitchGroup,
    SwitchItem,
    // Buttons
    Button,
    Buttons,
    // Layout
    Stack,
    Tabs,
    TabItem,
    Accordion,
    AccordionItem,
    Steps,
    StepsItem,
    Carousel,
    Separator,
    // Data Display
    TagBlock,
    Tag,
  ],
});
