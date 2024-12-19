import z from 'zod';
import { thumbnailInfoSchema } from './thumbnail-info.type';
import { encryptedFileSchema } from './encrypted-file.type';

export const locationInfoSchema = z.object({
  thumbnail_file: encryptedFileSchema.optional(),
  thumbnail_info: thumbnailInfoSchema.optional(),
  thumbnail_url: z.string().url().optional(),
});

export type LocationInfo = z.infer<typeof locationInfoSchema>;
