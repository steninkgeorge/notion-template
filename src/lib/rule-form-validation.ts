import { z } from 'zod';

export const ruleFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .refine((val) => val.trim().split(/\s+/).length <= 5, {
      message: 'Title must be at most 5 words',
    }),
  prompt: z
    .string()
    .min(1, { message: 'Prompt is required' })
    .refine((val) => val.trim().split(/\s+/).length <= 50, {
      message: 'Prompt must be at most 50 words',
    }),
  color: z.string(),
  backgroundColor: z.string(),
});

export type RuleFormData = z.infer<typeof ruleFormSchema>;
