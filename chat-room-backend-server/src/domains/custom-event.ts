import { z } from 'zod';

export const customEventSchema = z.object({
  type: z.string(),
  contents: z.record(z.unknown()),
});

export type CustomEvent = z.infer<typeof customEventSchema>;
