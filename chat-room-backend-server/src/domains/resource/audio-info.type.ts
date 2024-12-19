import z from 'zod';

export const audioInfoSchema = z.object({
  duration: z.number().optional(),
  mimetype: z.string().optional(),
  size: z.number().optional(),
});

export type AudioInfo = z.infer<typeof audioInfoSchema>;
