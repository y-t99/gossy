import { z } from 'zod';

export const syncEventRoSchema = z.object({
  filter: z.string().optional(),
  full_state: z.boolean().default(false).optional(),
  set_presence: z.enum(['online', 'offline', 'unavailable']).optional(),
  since: z.string().optional(),
  timeout: z.number().default(0).optional(),
});

export type SyncEventRo = z.infer<typeof syncEventRoSchema>;
