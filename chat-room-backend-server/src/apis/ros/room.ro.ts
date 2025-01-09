import { z } from 'zod';

export const roomRoSchema = z.object({
  room_id: z.string(),
});

export type RoomRo = z.infer<typeof roomRoSchema>;
