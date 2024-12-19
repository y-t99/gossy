import { RoomMessageType } from '../../../enums';
import { z } from 'zod';

export const emoteMessageContentSchema = z.object({
  body: z.string(),
  format: z.string().optional(),
  formatted_body: z.string().optional(),
  msgtype: z.literal(RoomMessageType.EMOTE),
});
