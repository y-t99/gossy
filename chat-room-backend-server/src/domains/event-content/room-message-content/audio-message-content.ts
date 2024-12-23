import { audioInfoSchema } from '../../resource/audio-info.type';
import { RoomMessageType } from '../../../enums';
import { z } from 'zod';

export const audioMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.AUDIO),
  file: z.string(),
  filename: z.string(),
  format: z.string(),
  formatted_body: z.string().optional(),
  info: audioInfoSchema.optional(),
  url: z.string().url().optional(),
});

export type AudioMessageContent = z.infer<typeof audioMessageContentSchema>;
