import { z } from 'zod';
import { roomEventWithoutRoomIdSchema } from './room-event';

export const timelineSchema = z.object({
  events: z.array(roomEventWithoutRoomIdSchema),
  limit: z.number().optional(),
  prev_batch: z.string().optional(),
});

export type Timeline = z.infer<typeof timelineSchema>;
