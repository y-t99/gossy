import z from 'zod';

export const signupRoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  againPassword: z.string(),
  code: z.string(),
});
