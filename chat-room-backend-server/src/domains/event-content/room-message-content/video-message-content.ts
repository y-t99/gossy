import { RoomMessageType } from '../../../enums';
import {
  videoInfoSchema,
  encryptedFileSchema,
} from '../../../domains/resource';
import { z } from 'zod';

export const videoMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.VIDEO),
  file: encryptedFileSchema.optional(),
  filename: z.string().optional(),
  format: z.string().optional(),
  formatted_body: z.string().optional(),
  info: videoInfoSchema.optional(),
  url: z.string().url().optional(),
});
