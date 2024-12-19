import { RoomMessageType } from '../../../enums';
import { z } from 'zod';

export const noticeMessageContentSchema = z.object({
  body: z.string(),
  format: z.string().optional(),
  formatted_body: z.string().optional(),
  msgtype: z.literal(RoomMessageType.NOTICE),
});
