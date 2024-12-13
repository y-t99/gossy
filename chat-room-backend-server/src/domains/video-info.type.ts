import z from 'zod';
import { encryptedFileSchema } from './encrypted-file.type';
import { thumbnailInfoSchema } from './thumbnail-info.type';

export const videoInfoSchema = z.object({
  duration: z.number().optional(),
  h: z.number().optional(),
  mimetype: z.string().optional(),
  size: z.number().optional(),
  w: z.number().optional(),
  thumbnail_info: thumbnailInfoSchema.optional(),
  thumbnail_file: encryptedFileSchema.optional(),
  thumbnail_url: z.string().url().optional(),
});

export type VideoInfo = z.infer<typeof videoInfoSchema>;
