import { z } from 'zod';

export const roomCreateContentSchema = z.object({
  room_version: z
    .string()
    .default('1')
    .optional()
    .describe(
      'The version of the room. Defaults to "1" if the key does not exist.',
    ),
  creator: z
    .string()
    .describe(
      'The user_id of the room creator. Required for, and only present in, room versions 1 - 10. Starting with room version 11 the event sender should be used instead.',
    ),
  type: z.string().optional(),
  predecessor: z
    .object({
      event_id: z
        .string()
        .describe('The event ID of the last known event in the old room.'),
      room_id: z.string().describe('The ID of the old room.'),
    })
    .optional()
    .describe(
      'A reference to the room this room replaces, if the previous room was upgraded.',
    ),
  'm.federate': z
    .boolean()
    .default(true)
    .optional()
    .describe(
      'Whether users on other servers can join this room. Defaults to true if key does not exist.',
    ),
});

export type RoomCreateContent = z.infer<typeof roomCreateContentSchema>;
