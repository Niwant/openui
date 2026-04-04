import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const TreemapItemSchema = z.object({
  category: z.string(),
  value: z.number(),
});

export const TreemapItem = defineComponent({
  name: "TreemapItem",
  props: TreemapItemSchema,
  description: "One treemap category with a numeric value",
  component: () => null,
});
