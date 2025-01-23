import { z } from "zod";

const insertCartSchema = z.object({
  quantity: z.number(),
  productId: z.string(),
  category: z.string(),
  variant: z.string(),
});

export { insertCartSchema };
