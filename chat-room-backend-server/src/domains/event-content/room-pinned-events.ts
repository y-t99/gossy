import { z } from 'zod';

export const roomPinnedEventsContentSchema = z.object({
  pinned: z.array(z.string()),
});
