import { z } from 'zod';

export const roomPowerLevelsContentSchema = z.object({
  ban: z.number().optional(),
  events: z.record(z.number()).optional(),
  events_default: z.number().optional(),
  invite: z.number().optional(),
  kick: z.number().optional(),
  notifications: z
    .union([
      z.object({
        room: z.number().default(50).optional(),
      }),
      z.record(z.number()),
    ])
    .optional(),
  redact: z.number().optional(),
  state_default: z.number().optional(),
  users: z.record(z.number()).optional(),
  users_default: z.number().optional(),
});

export type RoomPowerLevelsContent = z.infer<
  typeof roomPowerLevelsContentSchema
>;
