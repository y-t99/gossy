import {
  encryptedFileSchema,
  imageInfoSchema,
} from '../../../domains/resource';
import { RoomMessageType } from '../../../enums';
import z from 'zod/lib';

export const imageMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.IMAGE),
  file: encryptedFileSchema.optional(),
  filename: z.string(),
  format: z.string(),
  formatted_body: z.string().optional(),
  info: imageInfoSchema,
  url: z.string().url().optional(),
});

export type ImageMessageContent = z.infer<typeof imageMessageContentSchema>;
