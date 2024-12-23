import { z } from 'zod';

export const roomPinnedEventsContentSchema = z.object({
  pinned: z.array(z.string()),
});

export type RoomPinnedEventsContent = z.infer<
  typeof roomPinnedEventsContentSchema
>;
