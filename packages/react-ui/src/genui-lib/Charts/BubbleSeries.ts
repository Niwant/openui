import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { BubblePointSchema } from "./BubblePoint";

export const BubbleSeriesSchema = z.object({
  name: z.string(),
  points: z.array(BubblePointSchema),
});

export const BubbleSeries = defineComponent({
  name: "BubbleSeries",
  props: BubbleSeriesSchema,
  description: "Named bubble dataset",
  component: () => null,
});
