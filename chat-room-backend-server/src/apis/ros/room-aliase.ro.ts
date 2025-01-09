import { z } from 'zod';

export const roomAliasPathSchema = z.object({
  room_alias: z.string(),
});

export type RoomAliasPath = z.infer<typeof roomAliasPathSchema>;

export const roomAliasRoSchema = z.object({
  room_id: z.string(),
});

export type RoomAliasRo = z.infer<typeof roomAliasRoSchema>;
