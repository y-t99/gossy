import { RoomJoinRules, RoomMembershipStates } from '../enums';
import z from 'zod';
import { thumbnailInfoSchema } from './thumbnail-info.type';

export const roomCanonicalAliasContentSchema = z.object({
  alias: z
    .string()
    .nullable()
    .optional()
    .describe(
      'The canonical alias for the room. If not present, null, or empty the room should be considered to have no canonical alias.',
    ),
  alt_aliases: z
    .array(z.string())
    .nullable()
    .optional()
    .describe(
      'Alternative aliases the room advertises. This list can have aliases despite the alias field being null, empty, or otherwise not present.',
    ),
});

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

export const roomJoinRulesContentSchema = z.object({
  allow: z
    .array(
      z.object({
        room_id: z
          .string()
          .describe(
            'Required if type is m.room_membership. The room ID to check the user’s membership against. If the user is joined to this room, they satisfy the condition and thus are permitted to join the restricted room.',
          ),
        type: z.literal('m.room_membership'),
      }),
    )
    .describe(
      'For restricted rooms, the conditions the user will be tested against. The user needs only to satisfy one of the conditions to join the restricted room. If the user fails to meet any condition, or the condition is unable to be confirmed as satisfied, then the user requires an invite to join the room. Improper or no allow conditions on a restricted join rule imply the room is effectively invite-only (no conditions can be satisfied).',
    ),
  join_rule: z.nativeEnum(RoomJoinRules),
});

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

export const roomMessageContentSchema = z.object({
  body: z.string(),
  msgtype: z.string(),
});

export const roomNameContentSchema = z.object({
  name: z.string(),
});

export const roomTopicContentSchema = z.object({
  topic: z.string(),
});

export const roomAvatarContentSchema = z.object({
  info: z
    .object({
      mimetype: z.string().optional(),
      size: z.number().optional(),
      h: z.number().optional(),
      w: z.number().optional(),
      thumbnail_info: thumbnailInfoSchema.optional(),
      thumbnail_url: z.string().url().optional(),
    })
    .optional(),
  url: z.string().url().optional(),
});

export const roomPinnedEventsContentSchema = z.object({
  pinned: z.array(z.string()),
});
