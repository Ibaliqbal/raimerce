import { z } from "zod";
import { mediaSchema } from "./product";

export const updateStoreSchema = z.object({
  name: z.string().max(15),
  email: z.string().email(),
  description: z.string().max(350),
});

export type UpdateStoreSchemaT = z.infer<typeof updateStoreSchema>;

export const newsSchema = z.object({
  description: z.string().min(10).max(1150).trim(),
  medias: mediaSchema.array().max(4).default([]),
});

export type NewsSchemaT = z.infer<typeof newsSchema>;

export const gettingStartedSchema = z.object({
  name: z.string().min(5).max(20),
  email: z.string().email(),
  description: z.string().min(10).max(250),
  agreeRule: z.boolean(),
  headerPhoto: mediaSchema,
});

export type GettingStartedSchemaT = z.infer<typeof gettingStartedSchema>;
