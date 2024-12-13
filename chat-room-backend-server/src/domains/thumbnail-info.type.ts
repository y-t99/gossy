import z from 'zod';

export const thumbnailInfoSchema = z.object({
  h: z.number().optional(),
  w: z.number().optional(),
  mimetype: z.string().optional(),
  size: z.number().optional(),
});

export type ThumbnailInfo = z.infer<typeof thumbnailInfoSchema>;
