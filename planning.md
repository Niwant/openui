# Chart Expansion Plan

## Context

OpenUI currently has two chart layers:

1. **Rendering layer** in `packages/react-ui/src/components/Charts/`
   - Built on top of `recharts`
   - Contains chart container, theming, tooltips, legends, export helpers, sizing, hover behavior, and some animation support

2. **LLM-facing chart layer** in `packages/react-ui/src/genui-lib/Charts/`
   - Exposes a smaller, safer subset of chart types and props to the model
   - Uses `defineComponent(...)` and Zod schemas
   - Transforms model-friendly inputs into the richer React chart components

The main opportunity is to expand the LLM-facing layer without breaking reliability, consistency, or bundle discipline.

---

## Goals

- Expand the set of charts the LLM can generate
- Standardize a shared chart API across existing and new charts
- Add controlled animation support for LLM-generated charts
- Preserve LLM reliability by keeping schemas simple and well-bounded
- Keep the default chart path Recharts-based
- Leave room for a future advanced visualization track if needed

## Non-Goals

- Do not expose the full Recharts API directly to the LLM
- Do not rewrite the current chart system in D3
- Do not mix imperative D3 behavior into the current standard chart family
- Do not add many new chart types before defining a stable shared contract

---

## Current State Summary

### Rendering layer already supports

- Scrollable and condensed line, bar, and area charts
- Horizontal bar chart
- Pie chart
- Radar chart
- Radial chart
- Scatter chart
- Single stacked bar chart
- Mini charts

### LLM-facing layer currently exposes

- `BarChart`
- `LineChart`
- `AreaChart`
- `RadarChart`
- `HorizontalBarChart`
- `PieChart`
- `RadialChart`
- `SingleStackedBarChart`
- `ScatterChart`
- Helper nodes: `Series`, `Slice`, `ScatterSeries`, `Point`

### Architectural constraint

The LLM-facing layer is intentionally smaller than the rendering layer because it must remain:

- easy for models to generate
- easy to validate with Zod
- stable for prompt generation
- consistent across `openuiLibrary` and `openuiChatLibrary`

---

## Phase 0 - Foundation and Contract Design

### Objective

Define the shared chart contract the LLM will use before adding more chart types.

### Work

- Audit all existing chart component props in `packages/react-ui/src/components/Charts/`
- Inventory which props are already safe for model generation
- Define a common LLM-safe chart option set across chart families
- Normalize naming and behavior across 1D, 2D, and scatter-like charts
- Decide which options belong in:
  - shared base schema
  - family-specific schema
  - chart-specific schema only

### Proposed shared options

- `title`
- `subtitle`
- `theme`
- `legend`
- `animated`
- `animationDuration`
- `xLabel`
- `yLabel`
- `format`
- `showGrid`

### Deliverables

- Chart capability matrix
- Shared schema guidelines
- Prop naming rules
- List of supported chart families and their allowed options

### Success Criteria

- Every current chart can be described using a consistent model-facing contract
- No chart requires exposing raw Recharts internals
- Prompt examples can explain chart generation in a uniform way

---

## Phase 1 - Expand LLM Support for Existing Charts

### Objective

Expose more of the existing chart system to the LLM in a disciplined way.

### Work

- Add shared chart options to existing `genui-lib` chart schemas
- Introduce shared helpers for repeated chart wrapper logic
- Align existing chart wrappers so they accept the same core options
- Update prompt rules and examples so the model learns the new chart vocabulary
- Ensure both `openuiLibrary` and `openuiChatLibrary` remain aligned

### Candidate upgrades for current charts

- enable optional animation where already supported
- expose legend toggles consistently
- expose axis labels consistently
- expose format options consistently
- expose grid options where relevant
- standardize theme and palette selection

### Deliverables

- Updated schemas in `packages/react-ui/src/genui-lib/Charts/`
- Updated registration in:
  - `packages/react-ui/src/genui-lib/openuiLibrary.tsx`
  - `packages/react-ui/src/genui-lib/openuiChatLibrary.tsx`
- Updated unions in `packages/react-ui/src/genui-lib/unions.ts`
- New examples for prompt generation

### Success Criteria

- Existing chart types become more useful without becoming verbose or brittle
- Prompt examples stay short and predictable
- Backward compatibility is preserved for current OpenUI chart syntax

---

## Phase 2 - Add New Chart Types

### Objective

Expand chart coverage with high-value, LLM-friendly additions.

### Priority order

1. `BubbleChart`
2. `ComposedChart` or `ComboChart`
3. `Treemap`
4. `FunnelChart`
5. Optional later: `Heatmap`

### 2.1 BubbleChart

#### Why first

- Scatter data already includes optional `z` in the current schema
- Bubble is a natural extension of current scatter support
- Strong dashboard value with relatively low conceptual overhead

#### Work

- Add or extend rendering support in `components/Charts`
- Reuse scatter data structure where possible
- Map `z` to bubble size
- Add safe defaults for radius scaling, legend, and tooltip behavior
- Add LLM-facing wrapper and examples

### 2.2 Composed/Combo Chart

#### Why

- Very common for dashboards
- Strong business use case
- Lets the model show bars + line in one chart

#### Work

- Define a simple schema for mixed series types
- Keep allowed combinations constrained
- Avoid exposing arbitrary per-series styling initially

### 2.3 Treemap / Funnel

#### Why

- High-value business visuals
- Useful, but need careful schema design

#### Constraint

- Only add if schema remains simple enough for reliable model output

### Deliverables

- New rendering components where needed
- New genui wrappers and schemas
- Library registration and unions updated
- Storybook coverage and prompt examples

### Success Criteria

- At least two new chart types are available to the LLM
- New charts follow the same shared contract from Phase 0
- New charts do not require special-case prompt instructions beyond examples

---

## Phase 3 - Standardized Animation Support

### Objective

Add animation in a controlled, accessible, reusable way.

### Work

- Define shared animation props for LLM-facing charts
- Normalize animation behavior across chart families
- Respect print mode and reduced-motion preferences
- Add safe defaults so animation is optional and non-disruptive

### Proposed animation contract

- `animated?: boolean`
- `animationDuration?: number`
- `animationPreset?: "default" | "gentle" | "fast"`

### Rules

- `animated` defaults to `false` for LLM-generated charts unless explicitly enabled
- print mode disables animation
- reduced-motion should disable or simplify animation
- avoid highly theatrical transitions in the standard chart family

### Deliverables

- Shared animation helper utilities
- Unified animation behavior in chart wrappers
- Updated prompt examples showing when animation is appropriate

### Success Criteria

- Animation feels consistent across charts
- No chart requires bespoke animation props for basic usage
- Accessibility is preserved

---

## Phase 4 - Quality, Prompting, and Documentation

### Objective

Make the expanded chart system reliable for both developers and LLMs.

### Work

- Add prompt examples for each supported chart family
- Add chart selection guidance:
  - when to use bar vs line vs pie vs bubble vs combo
- Add schema-level validation for common data mistakes
- Add Storybook examples for happy path and edge cases
- Add tests for schema-to-render data transforms
- Validate export behavior where supported

### Test focus

- schema validation
- transform correctness
- backward compatibility
- prompt example realism
- reduced-motion and print behavior

### Deliverables

- Example library snippets
- Prompt rules
- Storybook stories
- Tests around transformations and validation

### Success Criteria

- Model outputs become more reliable, not less
- New chart types are documented with examples the model can imitate
- Regressions in existing chart behavior are caught early

---

## Phase 5 - Advanced Visualization Track (Optional)

### Objective

Decide whether OpenUI should support a second, more expressive chart family for bespoke visuals.

### Recommendation

Treat this as a separate track, not an extension of the default chart family.

### Why

The current standard chart system is optimized for:

- structured business charts
- reliable model generation
- schema simplicity
- consistency

D3 or custom SVG charts are better for:

- bespoke storytelling visuals
- high-motion presentation graphics
- custom layouts and interactions

### If pursued

- create a separate advanced chart namespace or library family
- do not reuse the exact same assumptions as standard charts
- keep schemas constrained even if implementation is custom
- avoid mixing imperative D3 patterns into the standard Recharts path

### Candidate scope

- custom animated bubble chart
- sankey-like flows
- timeline visuals
- storytelling progress visuals

### Success Criteria

- advanced charts remain opt-in
- standard charts stay simple and stable
- the advanced path does not degrade default OpenUI usability

---

## Cross-Cutting Design Principles

- Prefer a small number of strong defaults over many knobs
- Reuse shared schemas and helpers aggressively
- Keep `openuiLibrary` and `openuiChatLibrary` aligned where possible
- Add examples whenever a new chart type is added
- Avoid chart types that require too much imperative logic in the model-facing API
- Preserve backward compatibility unless a deprecation path is documented

---

## Risks

### API bloat

Too many chart-specific options will hurt LLM reliability.

### Schema fragmentation

If each chart family invents different prop names, prompt generation becomes harder.

### Bundle growth

Adding a second charting stack too early will increase complexity and footprint.

### Accessibility gaps

Animations and complex charts may reduce usability if motion and fallback behavior are not handled carefully.

### Maintenance cost

Every new chart requires work in:

- rendering layer
- schema layer
- prompt examples
- registration
- stories
- tests

---

## Recommended Prioritization

### Recommended path

- Phase 0
- Phase 1
- Phase 2 with `BubbleChart`
- Phase 2 with `ComposedChart`
- Phase 3
- Phase 4
- Phase 5 only if product demand remains strong

### Recommended product focus

Optimize first for **LLM-safe business dashboard charts**, not storytelling visuals.

Reason:

- strongest fit with current architecture
- easiest schema design
- highest reliability for model output
- lower maintenance risk

---

## Implementation Checklist

- [ ] Define shared chart contract
- [ ] Audit existing chart props
- [ ] Expand current LLM chart wrappers
- [ ] Update prompt examples and rules
- [ ] Add `BubbleChart`
- [ ] Add `ComposedChart` or `ComboChart`
- [ ] Add shared animation contract
- [ ] Add tests for data transforms and validation
- [ ] Add Storybook examples for all new charts
- [ ] Evaluate whether advanced D3-backed charts are still needed

---

## Definition of Done

This initiative is complete when:

- the LLM can generate a meaningfully broader set of charts
- existing charts have a consistent model-facing API
- at least two new chart types are available
- animation is supported in a controlled way
- docs, examples, and validation are updated
- the standard chart system remains easy for models to use
