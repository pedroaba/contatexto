import { z } from "zod";

export const analysisFilterSchema = z.enum(["all", "with-ai", "without-ai"]);

export const createAnalysisSchema = z.object({
  text: z.string(),
  title: z.string().trim().max(120).optional(),
});

export const updateAnalysisSchema = z
  .object({
    text: z.string().optional(),
    title: z.string().trim().max(120).optional(),
  })
  .refine((value) => value.text !== undefined || value.title !== undefined, {
    message: "Envie pelo menos um campo para atualizar a análise.",
  });
