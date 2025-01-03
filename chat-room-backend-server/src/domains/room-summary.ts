import { z } from 'zod';

export const roomSummarySchema = z.object({
  'm.heroes': z.array(z.string()),
  'm.invited_member_count': z.number().optional(),
  'm.joined_member_count': z.number().optional(),
});

export type RoomSummary = z.infer<typeof roomSummarySchema>;
