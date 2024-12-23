import { RoomMembershipStates } from '../../enums';
import { z } from 'zod';

export const roomMemberContentSchema = z.object({
  avatar_url: z.string().url().nullable().optional(),
  displayname: z.string().nullable().optional(),
  is_direct: z.boolean().nullable().optional(),
  join_authorised_via_users_server: z.string().nullable().optional(),
  membership: z.nativeEnum(RoomMembershipStates),
  reason: z.string().nullable().optional(),
  third_party_invite: z
    .object({
      display_name: z.string(),
      signed: z.object({
        mxid: z.string(),
        signatures: z.record(z.record(z.string())),
        token: z.string(),
      }),
    })
    .nullable()
    .optional(),
});

export type RoomMemberContent = z.infer<typeof roomMemberContentSchema>;
