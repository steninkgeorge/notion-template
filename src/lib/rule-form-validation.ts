import { z } from 'zod';

export const ruleFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  prompt: z.string().min(1, { message: 'Prompt is required' }),
  color: z.string(),
  backgroundColor: z.string(),
});

export type RuleFormData = z.infer<typeof ruleFormSchema>;
