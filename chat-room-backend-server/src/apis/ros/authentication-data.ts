import { z } from 'zod';

export const authenticationDataSchema = z
  .object({
    session: z.string(),
    type: z.string().optional(),
  })
  .and(z.record(z.unknown()));

export type AuthenticationData = z.infer<typeof authenticationDataSchema>;
