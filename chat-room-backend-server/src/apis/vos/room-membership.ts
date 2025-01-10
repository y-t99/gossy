import z from 'zod';

const _joinedRoomsVoSchema = z.object({
  joined_rooms: z.array(z.string()),
});

export type JoinedRoomsVo = z.infer<typeof _joinedRoomsVoSchema>;
