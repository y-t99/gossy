import { locationInfoSchema } from '../../../domains/resource';
import { RoomMessageType } from '../../../enums';
import { z } from 'zod';

export const locationMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.literal(RoomMessageType.LOCATION),
  geo_uri: z.string().url(),
  info: locationInfoSchema.optional(),
});

export type LocationMessageContent = z.infer<
  typeof locationMessageContentSchema
>;
