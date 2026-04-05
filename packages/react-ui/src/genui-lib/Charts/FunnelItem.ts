import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const FunnelItemSchema = z.object({
  category: z.string(),
  value: z.number(),
});

export const FunnelItem = defineComponent({
  name: "FunnelItem",
  props: FunnelItemSchema,
  description: "One funnel stage with a label and numeric value",
  component: () => null,
});
