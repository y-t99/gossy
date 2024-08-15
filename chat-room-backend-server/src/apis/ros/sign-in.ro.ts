import { z } from 'zod';

export const signinRoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignInRo = z.infer<typeof signinRoSchema>;
