import { z } from 'zod';

export const roomNameContentSchema = z.object({
  name: z.string(),
});
