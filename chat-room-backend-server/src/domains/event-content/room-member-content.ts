import { RoomMembershipStates } from '../../enums';
import { z } from 'zod';

export const roomMemberContentSchema = z.object({
  avatar_url: z.string().url().optional(),
  displayname: z.string().optional(),
  is_direct: z.boolean().optional(),
  join_authorised_via_users_server: z.boolean().optional(),
  membership: z.nativeEnum(RoomMembershipStates),
  reason: z.string().optional(),
  third_party_invite: z
    .object({
      display_name: z.string(),
      signed: z.object({
        mxid: z.string(),
        signatures: z.record(z.record(z.string())),
        token: z.string(),
      }),
    })
    .optional(),
});

export type RoomMemberContent = z.infer<typeof roomMemberContentSchema>;
