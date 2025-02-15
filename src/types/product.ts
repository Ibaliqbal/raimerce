import { z } from "zod";

export const variantSchema = z
  .object({
    name_variant: z.string().min(1, { message: "Name variant is required" }),
    price: z.number(),
    stock: z.number(),
    medias: z
      .array(
        z.object({
          keyFile: z.string(),
          name: z.string(),
          url: z.string(),
          type: z.string(),
        })
      )
      .default([]),
  })
  .refine(({ medias }) => medias.length > 0, {
    message: "At least 1 media",
    path: ["medias"],
  });

export const productSchema = z.object({
  name: z.string().min(6, { message: "Name must be at least 6 characters" }),
  description: z
    .string()
    .min(15, { message: "Description must be at least 15 characters" })
    .max(1500, { message: "Description must not exceed 1500 characters" })
    .trim(),
  variant: variantSchema.array(),
  category: z.string().min(1, { message: "Category is required" }),
});

export const promoSchema = z
  .object({
    code: z.string().min(3).max(10),
    amount: z.union([
      z
        .string()
        .refine((val) => !isNaN(Number(val)), { message: "Invalid number" })
        .transform((val) => Number(val))
        .pipe(z.number().min(0).max(100)),
      z.number().min(0).max(100),
    ]),
    expireAt: z.date({ required_error: "A date of birth is required." }),
    allowedProducts: z.array(z.string()).min(1),
  })
  .refine(
    (data) => data.allowedProducts.length >= 0 || data.allowedProducts === null,
    {
      message: "Please insert allowed products",
      path: ["allowedProducts"],
    }
  );

export const mediaSchema = z.object({
  keyFile: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.string(),
});

export type PromoSchemaT = z.infer<typeof promoSchema>;

export type ProductSchemaT = z.infer<typeof productSchema>;

export type VariantSchemaT = z.infer<typeof variantSchema>;

export type TMedia = z.infer<typeof mediaSchema>;
