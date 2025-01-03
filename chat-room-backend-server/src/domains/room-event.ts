import { z } from 'zod';
import { eventContentSchema } from './event-content';
import { RoomEventType } from '../enums';

/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#room-event-format
 */
export const roomEventSchema = z.object({
  content: eventContentSchema,
  event_id: z.string(),
  origin_server_ts: z.number(),
  room_id: z.string(),
  sender: z.string(),
  type: z.nativeEnum(RoomEventType),
  state_key: z.string().optional(),
  unsigned: z
    .object({
      age: z.number().optional(),
      membership: z.string().optional(),
      prev_content: z.record(eventContentSchema).optional(),
      redacted_because: z.string().optional().describe('RoomEvent'),
      transaction_id: z.string().optional(),
    })
    .optional(),
});

export const roomStrippedEventSchema = roomEventSchema
  .pick({
    content: true,
    sender: true,
    type: true,
  })
  .merge(
    z.object({
      state_key: z.string(),
    }),
  );

export const roomEventWithoutRoomIdSchema = roomEventSchema.omit({
  room_id: true,
});

export type RoomStrippedEvent = z.infer<typeof roomStrippedEventSchema>;
export type RoomEvent = z.infer<typeof roomEventSchema>;
export type RoomEventWithoutRoomId = z.infer<
  typeof roomEventWithoutRoomIdSchema
>;
