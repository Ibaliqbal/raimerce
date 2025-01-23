import { banks } from "@/utils/constant";
import { z } from "zod";
import { discountSchema } from "./promo";

export const chekcoutBody = z.object({
  productsID: z.array(z.string()),
  paymentMethod: z.enum(banks as [string, ...string[]]),
  discounts: z.array(discountSchema),
  storeIDs: z.array(z.string()),
});
