import { z } from "zod";

export const discountSchema = z.object({
  amount: z.number(),
  code: z.string(),
  appliedTo: z.string(),
});

export type DiscountSchemaT = z.infer<typeof discountSchema>;
