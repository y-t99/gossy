import { z } from 'zod';

import { RoomMessageType } from '../../../enums';

export const textMessageContentSchema = z.object({
  body: z.string(),
  format: z.string().optional(),
  formatted_body: z.string().optional(),
  msgtype: z.literal(RoomMessageType.TEXT),
});
