import { z } from 'zod';

export const roomNameContentSchema = z.object({
  name: z.string(),
});

export type RoomNameContent = z.infer<typeof roomNameContentSchema>;
