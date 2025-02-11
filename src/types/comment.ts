import { z } from "zod";
import { mediaSchema } from "./product";

export const commentSchema = z.object({
  content: z.string().min(10).max(500).trim(),
  medias: mediaSchema.array().max(2).default([]),
  rating: z.number().min(1).max(5),
});

export type CommentSchemaT = z.infer<typeof commentSchema>;
