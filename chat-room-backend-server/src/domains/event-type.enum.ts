import z from 'zod';
import { RoomJoinRules } from './room-join-rules.enum';
import { RoomMembershipStates } from './room-membership-states.enum';
import { thumbnailInfoSchema } from './thumbnail-info.type';

/**
 * Room events are split into two categories:
 *
 * State events: These are events which update the metadata state of the room (e.g. room topic, room membership etc).
 * State is keyed by a tuple of event type and a state_key.
 * State in the room with the same key-tuple will be overwritten.
 *
 * Message events: These are events which describe transient “once-off” activity in a room:
 * typically communication such as sending an instant message or setting up a VoIP call.
 *
 * @see https://spec.matrix.org/v1.12/client-server-api/#types-of-room-events
 */
export enum EventType {
  /**
   * This event is used to inform the room about which alias should be considered the canonical one, and which other aliases point to the room.
   * This could be for display purposes or as suggestion to users which alias to use to advertise and access the room.
   *
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomcanonical_alias
   */
  ROOM_CANONICAL_ALIAS = 'm.room.canonical_alias',

  /**
   * This is the first event in a room and cannot be changed. It acts as the root of all other events.
   *
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomcreate
   */
  ROOM_CREATE = 'm.room.create',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomjoin_rules
   */
  ROOM_JOIN_RULES = 'm.room.join_rules',

  /**
   * Event type: State event
   * State key: The user_id this membership event relates to. In all cases except for when membership is join, the user ID sending the event does not need to match the user ID in the state_key, unlike other events. Regular authorisation rules still apply.
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroommember
   */
  ROOM_MEMBER = 'm.room.member',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroompower_levels
   */
  ROOM_POWER_LEVELS = 'm.room.power_levels',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomname
   */
  ROOM_NAME = 'm.room.name',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomtopic
   */
  ROOM_TOPIC = 'm.room.topic',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroomavatar
   */
  ROOM_AVATAR = 'm.room.avatar',

  /**
   * Event type: State event
   * State key: The zero-length string
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroompinned_events
   */
  ROOM_PINNED_EVENTS = 'm.room.pinned_events',

  /**
   * This event is used when sending messages in a room. Messages are not limited to be text. The msgtype key outlines the type of message, e.g. text, audio, image, video, etc. The body key is text and MUST be used with every kind of msgtype as a fallback mechanism for when a client cannot render a message. This allows clients to display something even if it is just plain text.
   *
   * Event type: Message event
   *
   * @see https://spec.matrix.org/v1.12/client-server-api/#mroommessage
   */
  ROOM_MESSAGE = 'm.room.message',
}

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
