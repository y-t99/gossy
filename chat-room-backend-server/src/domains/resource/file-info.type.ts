import z from 'zod';
import { thumbnailInfoSchema } from './thumbnail-info.type';
import { encryptedFileSchema } from './encrypted-file.type';

export const fileInfoSchema = z.object({
  size: z.number(),
  mimetype: z.string(),
  thumbnail_file: encryptedFileSchema.optional(),
  thumbnail_info: thumbnailInfoSchema.optional(),
  thumbnail_url: z.string().url().optional(),
});

export type FileInfo = z.infer<typeof fileInfoSchema>;
