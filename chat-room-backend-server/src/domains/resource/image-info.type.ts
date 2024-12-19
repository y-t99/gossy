import z from 'zod';
import { thumbnailInfoSchema } from './thumbnail-info.type';
import { encryptedFileSchema } from './encrypted-file.type';

export const imageInfoSchema = z.object({
  h: z.number(),
  w: z.number(),
  mimetype: z.string(),
  size: z.number(),
  thumbnail_file: encryptedFileSchema.optional(),
  thumbnail_info: thumbnailInfoSchema.optional(),
  thumbnail_url: z.string().url().optional(),
});

export type ImageInfo = z.infer<typeof imageInfoSchema>;
