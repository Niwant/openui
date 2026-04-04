import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const BubblePointSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export const BubblePoint = defineComponent({
  name: "BubblePoint",
  props: BubblePointSchema,
  description: "Data point with x, y, and z values where z controls bubble size",
  component: () => null,
});
