import { encryptedFileSchema, fileInfoSchema } from '../../../domains/resource';
import { RoomMessageType } from '../../../enums';
import { z } from 'zod';

export const fileMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.FILE),
  file: encryptedFileSchema,
  filename: z.string(),
  format: z.string(),
  formatted_body: z.string().optional(),
  info: fileInfoSchema.optional(),
  url: z.string().url().optional(),
});
