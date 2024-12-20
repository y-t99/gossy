import { z } from 'zod';
import { thumbnailInfoSchema } from './thumbnail-info.type';

export const avatarInfoSchema = z.object({
  mimetype: z.string().optional(),
  size: z.number().optional(),
  h: z.number().optional(),
  w: z.number().optional(),
  thumbnail_info: thumbnailInfoSchema.optional(),
  thumbnail_url: z.string().url().optional(),
});

export type AvatarInfo = z.infer<typeof avatarInfoSchema>;
