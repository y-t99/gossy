import { z } from 'zod';

export const roomTopicContentSchema = z.object({
  topic: z.string(),
});

export type RoomTopicContent = z.infer<typeof roomTopicContentSchema>;
