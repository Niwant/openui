"use client";

import type { ComponentGroup, PromptOptions } from "@openuidev/react-lang";
import { createLibrary, defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { Card as OpenUICard } from "../components/Card";

// Content
import { Callout } from "./Callout";
import { CardHeader } from "./CardHeader";
import { CodeBlock } from "./CodeBlock";
import { Image } from "./Image";
import { ImageBlock } from "./ImageBlock";
import { ImageGallery } from "./ImageGallery";
import { MarkDownRenderer } from "./MarkDownRenderer";
import { Separator } from "./Separator";
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
  FunnelChart,
  FunnelItem,
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

// Layout (no Stack)
import { Accordion, AccordionItem } from "./Accordion";
import { Carousel } from "./Carousel";
import { Steps, StepsItem } from "./Steps";
import { TabItem, Tabs } from "./Tabs";

// Data Display
import { Col, Table } from "./Table";
import { Tag } from "./Tag";
import { TagBlock } from "./TagBlock";

// Chat-specific
import { FollowUpBlock } from "./FollowUpBlock";
import { FollowUpItem } from "./FollowUpItem";
import { ListBlock } from "./ListBlock";
import { ListItem } from "./ListItem";
import { SectionBlock } from "./SectionBlock";
import { SectionItem } from "./SectionItem";

import { ChatContentChildUnion } from "./unions";

// Tabs and Carousel are added here (not in unions.ts) to avoid the circular dep:
// Tabs/schema.ts imports ContentChildUnion from unions.ts.
const ChatCardChildUnion = z.union([...ChatContentChildUnion.options, Tabs.ref, Carousel.ref]);

// ── Locked Chat Card — no design params, always vertical ──

const ChatCard = defineComponent({
  name: "Card",
  props: z.object({
    children: z.array(ChatCardChildUnion),
  }),
  description:
    "Vertical container for all content in a chat response. Children stack top to bottom automatically.",
  component: ({ props, renderNode }) => (
    <OpenUICard
      width="full"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--openui-space-m)",
      }}
    >
      {renderNode(props.children)}
    </OpenUICard>
  ),
});

// ── Component Groups ──

export const openuiChatComponentGroups: ComponentGroup[] = [
  {
    name: "Content",
    components: [
      "CardHeader",
      "TextContent",
      "MarkDownRenderer",
      "Callout",
      "TextCallout",
      "Image",
      "ImageBlock",
      "ImageGallery",
      "CodeBlock",
      "Separator",
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
      "- FunnelChart takes items first, then optional theme, legend, animated, and format. Use it for conversion funnels, pipeline stages, or drop-off analysis.",
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
      "- Define EACH FormControl as its own reference — do NOT inline all controls in one array.",
      "- NEVER nest Form inside Form.",
      "- Form requires explicit buttons. Always pass a Buttons(...) reference as the third Form argument.",
      "- rules is an optional object: { required: true, email: true, min: 8, maxLength: 100 }",
      "- The renderer shows error messages automatically — do NOT generate error text in the UI",
    ],
  },
  {
    name: "Buttons",
    components: ["Button", "Buttons"],
  },
  {
    name: "Lists & Follow-ups",
    components: ["ListBlock", "ListItem", "FollowUpBlock", "FollowUpItem"],
    notes: [
      "- Use ListBlock with ListItem references for numbered, clickable lists.",
      "- Use FollowUpBlock with FollowUpItem references at the end of a response to suggest next actions.",
      "- Clicking a ListItem or FollowUpItem sends its text to the LLM as a user message.",
      '- Example: list = ListBlock([item1, item2])  item1 = ListItem("Option A", "Details about A")',
    ],
  },
  {
    name: "Sections",
    components: ["SectionBlock", "SectionItem"],
    notes: [
      "- SectionBlock renders collapsible accordion sections that auto-open as they stream.",
      "- Each section needs a unique `value` id, a `trigger` label, and a `content` array.",
      '- Example: sections = SectionBlock([s1, s2])  s1 = SectionItem("intro", "Introduction", [content1])',
      "- Set isFoldable=false to render sections as flat headers instead of accordion.",
    ],
  },
  {
    name: "Layout",
    components: ["Tabs", "TabItem", "Accordion", "AccordionItem", "Steps", "StepsItem", "Carousel"],
    notes: [
      "- Use Tabs to present alternative views — each TabItem has a value id, trigger label, and content array.",
      "- Carousel takes an array of slides, where each slide is an array of content: carousel = Carousel([[t1, img1], [t2, img2]])",
      "- IMPORTANT: Every slide in a Carousel must have the same structure — same component types in the same order.",
      "- For image carousels use: [[title, image, description, tags], ...] — every slide must follow this exact pattern.",
      "- Use real, publicly accessible image URLs (e.g. https://picsum.photos/seed/KEYWORD/800/500). Never hallucinate image URLs.",
    ],
  },
  {
    name: "Data Display",
    components: ["TagBlock", "Tag"],
  },
];

// ── Examples ──

export const openuiChatExamples: string[] = [
  `Example 1 — Table with follow-ups:
root = Card([title, tbl, followUps])
title = TextContent("Top Languages", "large-heavy")
tbl = Table(cols, rows)
cols = [Col("Language", "string"), Col("Users (M)", "number"), Col("Year", "number")]
rows = [["Python", 15.7, 1991], ["JavaScript", 14.2, 1995], ["Java", 12.1, 1995]]
followUps = FollowUpBlock([fu1, fu2])
fu1 = FollowUpItem("Tell me more about Python")
fu2 = FollowUpItem("Show me a JavaScript comparison")`,

  `Example 2 — Clickable list:
root = Card([title, list])
title = TextContent("Choose a topic", "large-heavy")
list = ListBlock([item1, item2, item3])
item1 = ListItem("Getting started", "New to the platform? Start here.")
item2 = ListItem("Advanced features", "Deep dives into powerful capabilities.")
item3 = ListItem("Troubleshooting", "Common issues and how to fix them.")`,

  `Example 3 — Image carousel with consistent slides + follow-ups:
root = Card([header, carousel, followups])
header = CardHeader("Featured Destinations", "Discover highlights and best time to visit")
carousel = Carousel([[t1, img1, d1, tags1], [t2, img2, d2, tags2], [t3, img3, d3, tags3]], "card")
t1 = TextContent("Paris, France", "large-heavy")
img1 = ImageBlock("https://picsum.photos/seed/paris/800/500", "Eiffel Tower at night")
d1 = TextContent("City of light — best Apr–Jun and Sep–Oct.", "default")
tags1 = TagBlock(["Landmark", "City Break", "Culture"])
t2 = TextContent("Kyoto, Japan", "large-heavy")
img2 = ImageBlock("https://picsum.photos/seed/kyoto/800/500", "Bamboo grove in Arashiyama")
d2 = TextContent("Temples and bamboo groves — best Mar–Apr and Nov.", "default")
tags2 = TagBlock(["Temples", "Autumn", "Culture"])
t3 = TextContent("Machu Picchu, Peru", "large-heavy")
img3 = ImageBlock("https://picsum.photos/seed/machupicchu/800/500", "Inca citadel in the clouds")
d3 = TextContent("High-altitude Inca citadel — best May–Sep.", "default")
tags3 = TagBlock(["Andes", "Hike", "UNESCO"])
followups = FollowUpBlock([fu1, fu2])
fu1 = FollowUpItem("Show me only beach destinations")
fu2 = FollowUpItem("Turn this into a comparison table")`,

  `Example 4 — Form with validation:
root = Card([title, form])
title = TextContent("Contact Us", "large-heavy")
form = Form("contact", btns, [nameField, emailField, msgField])
nameField = FormControl("Name", Input("name", "Your name", "text", { required: true, minLength: 2 }))
emailField = FormControl("Email", Input("email", "you@example.com", "email", { required: true, email: true }))
msgField = FormControl("Message", TextArea("message", "Tell us more...", 4, { required: true, minLength: 10 }))
btns = Buttons([Button("Submit", { type: "continue_conversation" }, "primary")])`,

  `Example 5 — Bar chart with chart controls:
root = Card([title, chart, followUps])
title = TextContent("Q4 Revenue", "large-heavy")
chart = BarChart(labels, [s1, s2], "grouped", "sunset", false, false, true, "Month", "Revenue ($K)")
labels = ["Oct", "Nov", "Dec"]
s1 = Series("Product A", [120, 150, 180])
s2 = Series("Product B", [90, 110, 140])
followUps = FollowUpBlock([fu1, fu2])
fu1 = FollowUpItem("Compare this with last quarter")
fu2 = FollowUpItem("Turn this into a donut chart")`,

  `Example 6 — Donut chart with percentage formatting:
root = Card([title, chart])
title = TextContent("Market Share", "large-heavy")
chart = PieChart(slices, "donut", "emerald", true, false, "percentage")
slices = [share1, share2, share3]
share1 = Slice("Alpha", 42)
share2 = Slice("Beta", 33)
share3 = Slice("Gamma", 25)`,

  `Example 7 — Bubble chart:
root = Card([title, chart, followUps])
title = TextContent("Campaign Performance", "large-heavy")
chart = BubbleChart([north, south], "spectrum", true, false, true, "Spend ($K)", "Pipeline ($K)")
north = BubbleSeries("North", [n1, n2, n3])
south = BubbleSeries("South", [s1, s2, s3])
n1 = BubblePoint(25, 180, 40)
n2 = BubblePoint(40, 240, 65)
n3 = BubblePoint(55, 330, 90)
s1 = BubblePoint(20, 150, 35)
s2 = BubblePoint(35, 220, 55)
s3 = BubblePoint(50, 295, 80)
followUps = FollowUpBlock([fu1, fu2])
fu1 = FollowUpItem("Turn this into a scatter plot")
fu2 = FollowUpItem("Highlight only the largest bubbles")`,

  `Example 8 — Combo chart:
root = Card([title, chart, followUps])
title = TextContent("Revenue vs Target", "large-heavy")
chart = ComboChart(labels, [revenue, target], "orchid", true, false, true, "Month", "Revenue ($K)")
labels = ["Jan", "Feb", "Mar", "Apr"]
revenue = ComboSeries("Revenue", [120, 145, 168, 190], "bar")
target = ComboSeries("Target", [110, 140, 160, 185], "line")
followUps = FollowUpBlock([fu1, fu2])
fu1 = FollowUpItem("Add a second line for forecast")
fu2 = FollowUpItem("Turn this into just a bar chart")`,

  `Example 9 — Treemap chart:
root = Card([title, chart, followUps])
title = TextContent("Portfolio Allocation", "large-heavy")
chart = TreemapChart(items, "vivid", true, false, "percentage")
items = [asset1, asset2, asset3, asset4, asset5]
asset1 = TreemapItem("Equities", 42)
asset2 = TreemapItem("Bonds", 24)
asset3 = TreemapItem("Real Estate", 16)
asset4 = TreemapItem("Cash", 10)
asset5 = TreemapItem("Alternatives", 8)
followUps = FollowUpBlock([fu1, fu2])
fu1 = FollowUpItem("Turn this into a donut chart")
fu2 = FollowUpItem("Show just the top three allocations")`,

  `Example 10 — Funnel chart:
root = Card([title, chart, followUps])
title = TextContent("Sales Pipeline", "large-heavy")
chart = FunnelChart(items, "ocean", true, false, "percentage")
items = [stage1, stage2, stage3, stage4]
stage1 = FunnelItem("Leads", 1200)
stage2 = FunnelItem("Qualified", 480)
stage3 = FunnelItem("Proposals", 220)
stage4 = FunnelItem("Closed", 95)
followUps = FollowUpBlock([fu1, fu2])
fu1 = FollowUpItem("Where is the biggest drop-off?")
fu2 = FollowUpItem("Show this as a bar chart instead")`,
];

export const openuiChatAdditionalRules: string[] = [
  "Every response is a single Card(children) — children stack vertically automatically. No layout params are needed on Card.",
  "Card is the only layout container. Do NOT use Stack. Use Tabs to switch between sections, Carousel for horizontal scroll.",
  "Use FollowUpBlock at the END of a Card to suggest what the user can do or ask next.",
  "Use ListBlock when presenting a set of options or steps the user can click to select.",
  "Use SectionBlock to group long responses into collapsible sections — good for reports, FAQs, and structured content.",
  "Use SectionItem inside SectionBlock: each item needs a unique value id, a trigger (header label), and a content array.",
  "Carousel takes an array of slides, where each slide is an array of content: carousel = Carousel([[t1, img1], [t2, img2]])",
  "IMPORTANT: Every slide in a Carousel must use the same component structure in the same order — e.g. all slides: [title, image, description, tags].",
  "For image carousels, always use real accessible URLs like https://picsum.photos/seed/KEYWORD/800/500. Never hallucinate or invent image URLs.",
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
  "Use FunnelChart when visualizing stages in a process like conversions, pipelines, or drop-off rates.",
  "FunnelChart items must use FunnelItem(category, value).",
  // Chart selection guidance
  "Use BarChart for comparing discrete categories or showing rankings.",
  "Use LineChart for trends over time or continuous data.",
  "Use AreaChart when you want to show cumulative totals or emphasize volume under the line.",
  "Use HorizontalBarChart for long category labels or when ranking is clearer horizontally.",
  "Use PieChart for showing composition of a whole (5-8 slices maximum).",
  "Use RadialChart for cyclical data or gauge-style visualizations.",
  "Use ScatterChart for correlation analysis between two numeric variables.",
  "Use BubbleChart when a third variable should also be visualized as point size.",
  "Use ComboChart when combining different data types in one view (e.g., actuals vs targets).",
  "Use TreemapChart when comparing many categories where area represents value.",
  "Use FunnelChart for conversion funnels, sales pipelines, or drop-off analysis.",
  "Use RadarChart for comparing multiple metrics across entities (e.g., skill profiles).",
  "Use SingleStackedBarChart for progress toward a goal or target.",
  "Use ScatterChart for finding patterns, clusters, or outliers in data.",
];

export const openuiChatPromptOptions: PromptOptions = {
  examples: openuiChatExamples,
  additionalRules: openuiChatAdditionalRules,
};

// ── Library ──

export const openuiChatLibrary = createLibrary({
  root: "Card",
  componentGroups: openuiChatComponentGroups,
  components: [
    // Root
    ChatCard,
    CardHeader,
    // Content
    TextContent,
    MarkDownRenderer,
    Callout,
    TextCallout,
    Image,
    ImageBlock,
    ImageGallery,
    CodeBlock,
    Separator,
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
    FunnelChart,
    FunnelItem,
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
    // Lists & Follow-ups
    ListBlock,
    ListItem,
    FollowUpBlock,
    FollowUpItem,
    // Sections
    SectionBlock,
    SectionItem,
    // Layout (no Stack)
    Tabs,
    TabItem,
    Accordion,
    AccordionItem,
    Steps,
    StepsItem,
    Carousel,
    // Data Display
    TagBlock,
    Tag,
  ],
});
