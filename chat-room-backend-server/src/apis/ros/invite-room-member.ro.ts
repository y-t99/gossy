import z from 'zod';

export const inviteRoomMemberRoSchema = z.object({
  user_id: z.string(),
  reason: z.string().optional(),
});

export type InviteRoomMemberRo = z.infer<typeof inviteRoomMemberRoSchema>;
