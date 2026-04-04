import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const ComboSeriesSchema = z.object({
  category: z.string(),
  values: z.array(z.number()),
  type: z.enum(["bar", "line"]),
});

export const ComboSeries = defineComponent({
  name: "ComboSeries",
  props: ComboSeriesSchema,
  description: "One combo-chart series with values and a required type of bar or line",
  component: () => null,
});
