import z from 'zod';

export const roomSchema = z.object({
  type: z.string(),
});

export type Room = z.infer<typeof roomSchema>;
