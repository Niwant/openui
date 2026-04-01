export const analyticsSnapshot = {
  organization: "Northstar Commerce",
  periodLabel: "Q1 2026",
  overview:
    "Revenue is running ahead of plan, retention remains healthy, and partner-sourced pipeline is carrying the quarter while paid social efficiency softens.",
  kpis: [
    {
      label: "Net revenue",
      value: "$1.84M",
      change: "+12.4% vs plan",
      changeDirection: "up",
    },
    {
      label: "Qualified pipeline",
      value: "$2.46M",
      change: "+8.1% month over month",
      changeDirection: "up",
    },
    {
      label: "Gross retention",
      value: "93.8%",
      change: "+1.7 pts vs last quarter",
      changeDirection: "up",
    },
    {
      label: "Paid social CAC",
      value: "$412",
      change: "+9.6% vs target",
      changeDirection: "risk",
    },
  ],
  weeklyRevenue: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    values: [255, 278, 291, 304, 318, 332],
  },
  channelPipeline: [
    { channel: "Partner", value: 610 },
    { channel: "Organic Search", value: 480 },
    { channel: "Outbound", value: 420 },
    { channel: "Paid Social", value: 295 },
  ],
  topAccounts: [
    { account: "Nova Retail", value: 420, stage: "Expansion", renewalRisk: "No" },
    { account: "Helio Health", value: 365, stage: "Proposal", renewalRisk: "Yes" },
    { account: "Atlas Finance", value: 310, stage: "Negotiation", renewalRisk: "No" },
    { account: "Blue Canyon", value: 260, stage: "Discovery", renewalRisk: "Yes" },
  ],
  insights: [
    "Partner-sourced opportunities now represent the strongest pipeline contributor and continue to close at the fastest pace.",
    "Paid social remains productive for volume, but acquisition cost has drifted high enough to warrant creative and audience changes.",
    "Two large renewal-oriented accounts need executive attention this month to protect next quarter carryover revenue.",
  ],
} as const;

export const analyticsSystemPrompt = `You are an analytics dashboard generator that responds only in OpenUI Lang.

Return ONLY valid openui-lang code.
Do not use markdown.
Do not wrap the response in backticks.
Do not explain your decisions.

Syntax rules:
1. Start with root = Stack(...)
2. Each statement must be on its own line using identifier = Component(...)
3. Use only double-quoted strings, numbers, booleans, arrays, and component calls
4. Every variable except root must be referenced by another variable
5. Write the output in top-down order so the layout is readable
6. Use only the components listed below
7. Never invent metrics, time periods, accounts, or recommendations that are not supported by the provided data

Allowed components and signatures:
Stack(children, direction?, gap?, align?, justify?, wrap?)
Card(children)
CardHeader(title?, subtitle?)
TextContent(text, size?)
Callout(variant, title, description)
Table(columns, rows)
Col(label, type?)
BarChart(labels, series, variant?, xLabel?, yLabel?)
LineChart(labels, series, variant?, xLabel?, yLabel?)
Series(category, values)

Important dashboard requirements:
- root must be a vertical Stack
- Build a compact executive analytics dashboard
- Include a title or overview section
- Include a KPI row with multiple small cards
- Include one trend chart
- Include one comparison chart
- Include one table for top accounts
- Include one executive takeaway callout
- Keep copy concise and insight-oriented

Example:
root = Stack([heroCard, metricRow, trendCard, takeaway], "column", "l")
heroCard = Card([heroHeader, heroBody])
heroHeader = CardHeader("Executive snapshot", "Weekly performance review")
heroBody = TextContent("Revenue accelerated while conversion remained stable.", "default")
metricRow = Stack([revenueCard, conversionCard], "row", "m", "stretch", "start", true)
revenueCard = Card([revenueLabel, revenueValue, revenueNote])
revenueLabel = TextContent("Revenue", "small-heavy")
revenueValue = TextContent("$1.24M", "large-heavy")
revenueNote = TextContent("+12% vs plan", "small")
conversionCard = Card([conversionLabel, conversionValue, conversionNote])
conversionLabel = TextContent("Conversion", "small-heavy")
conversionValue = TextContent("4.8%", "large-heavy")
conversionNote = TextContent("+0.4 pts week over week", "small")
trendCard = Card([trendHeader, trendChart])
trendHeader = CardHeader("Weekly revenue", "Last 6 weeks")
trendChart = LineChart(["W1", "W2", "W3"], [revenueSeries], "linear", "Week", "Revenue ($k)")
revenueSeries = Series("Revenue", [120, 132, 148])
takeaway = Callout("success", "Executive takeaway", "Growth is healthy and partner-sourced demand is leading the quarter.")`;

export function buildAnalyticsUserPrompt() {
  return `Create an executive analytics dashboard for ${analyticsSnapshot.organization} using the verified backend data below.

The dashboard should help a revenue leader understand what is performing well, where risk is emerging, and which accounts deserve attention.

Use only the provided data.
Keep the layout compact, boardroom-ready, and focused on signal over noise.

Verified data:
${JSON.stringify(analyticsSnapshot, null, 2)}`;
}

export function buildFallbackAnalyticsUi() {
  return `root = Stack([heroCard, metricRow, analysisRow, accountCard, takeaway], "column", "l")
heroCard = Card([heroHeader, heroBody])
heroHeader = CardHeader("Executive analytics snapshot", "Northstar Commerce - Q1 2026")
heroBody = TextContent("Revenue is running ahead of plan, retention remains healthy, and partner-sourced pipeline is carrying the quarter while paid social efficiency softens.", "default")
metricRow = Stack([revenueCard, pipelineCard, retentionCard, cacCard], "row", "m", "stretch", "start", true)
revenueCard = Card([revenueLabel, revenueValue, revenueNote])
revenueLabel = TextContent("Net revenue", "small-heavy")
revenueValue = TextContent("$1.84M", "large-heavy")
revenueNote = TextContent("+12.4% vs plan", "small")
pipelineCard = Card([pipelineLabel, pipelineValue, pipelineNote])
pipelineLabel = TextContent("Qualified pipeline", "small-heavy")
pipelineValue = TextContent("$2.46M", "large-heavy")
pipelineNote = TextContent("+8.1% month over month", "small")
retentionCard = Card([retentionLabel, retentionValue, retentionNote])
retentionLabel = TextContent("Gross retention", "small-heavy")
retentionValue = TextContent("93.8%", "large-heavy")
retentionNote = TextContent("+1.7 pts vs last quarter", "small")
cacCard = Card([cacLabel, cacValue, cacNote])
cacLabel = TextContent("Paid social CAC", "small-heavy")
cacValue = TextContent("$412", "large-heavy")
cacNote = TextContent("+9.6% vs target", "small")
analysisRow = Stack([trendCard, channelCard], "row", "m", "stretch", "start", true)
trendCard = Card([trendHeader, trendChart])
trendHeader = CardHeader("Weekly revenue trend", "Last 6 weeks")
trendChart = LineChart(["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"], [revenueSeries], "linear", "Week", "Revenue ($k)")
revenueSeries = Series("Revenue", [255, 278, 291, 304, 318, 332])
channelCard = Card([channelHeader, channelChart])
channelHeader = CardHeader("Pipeline contribution by channel", "Qualified opportunities created")
channelChart = BarChart(["Partner", "Organic Search", "Outbound", "Paid Social"], [pipelineSeries], "grouped", "Channel", "Pipeline ($k)")
pipelineSeries = Series("Pipeline", [610, 480, 420, 295])
accountCard = Card([accountHeader, accountTable])
accountHeader = CardHeader("Top accounts at a glance", "Largest opportunities by value")
accountTable = Table([accountCol, valueCol, stageCol, riskCol], [["Nova Retail", 420, "Expansion", "No"], ["Helio Health", 365, "Proposal", "Yes"], ["Atlas Finance", 310, "Negotiation", "No"], ["Blue Canyon", 260, "Discovery", "Yes"]])
accountCol = Col("Account", "string")
valueCol = Col("Value ($k)", "number")
stageCol = Col("Stage", "string")
riskCol = Col("Renewal risk", "string")
takeaway = Callout("warning", "Executive takeaway", "Growth is healthy overall, but paid social efficiency and two renewal-heavy enterprise accounts need direct intervention this month.")`;
}
