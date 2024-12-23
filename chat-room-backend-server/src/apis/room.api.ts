import Router from '@koa/router';
import { pipeMiddleware } from '../middlewares';
import { CreateRoomRo, createRoomRoSchema } from './ros';
import { generateId } from '../utils';
import {
  Identifier,
  HostKeyEnum,
  RoomEventTypeEnum,
  RoomVersionEnum,
  RoomMembershipStates,
} from '../enums';
import {
  GuestAccessContent,
  HistoryVisibilityContent,
  RoomCanonicalAliasContent,
  RoomCreateContent,
  RoomEvent,
  RoomJoinRulesContent,
  RoomMemberContent,
  RoomNameContent,
  RoomPowerLevelsContent,
  RoomThirdPartyInviteContent,
  RoomTopicContent,
} from '../domains';
import { Context } from 'koa';

export const roomApis = new Router();

/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#post_matrixclientv3createroom
 */
roomApis.post(
  '/_matrix/client/v3/createRoom',
  pipeMiddleware({
    body: createRoomRoSchema,
  }),
  async (ctx: Context) => {
    const body: CreateRoomRo = ctx.request.body;
    const context = ctx.context;
    const roomId = generateId(Identifier.ROOM, HostKeyEnum.GOSSY);
    // The m.room.create event itself. Must be the first event in the room.
    const roomCreateContent: RoomCreateContent = {
      creator: context.uuid,
      room_version: body.room_version ?? RoomVersionEnum.V11,
      'm.federate': body.creation_content?.['m.federate'] ?? false,
      predecessor: body.creation_content?.predecessor,
      type: body.creation_content?.type,
    };
    const roomCreateEvent: RoomEvent = {
      event_id: generateId(Identifier.EVENT, HostKeyEnum.GOSSY),
      room_id: roomId,
      origin_server_ts: Date.now(),
      sender: context.uuid,
      type: RoomEventTypeEnum.Enum['m.room.create'],
      content: roomCreateContent,
    };
    // An m.room.member event for the creator to join the room. This is needed so the remaining events can be sent.
    const roomMemberContent: RoomMemberContent = {
      avatar_url: context.image,
      displayname: context.name,
      is_direct: body.id_direct ?? false,
      membership: RoomMembershipStates.JOIN,
      join_authorised_via_users_server: HostKeyEnum.GOSSY,
      reason: 'An m.room.member event for the creator to join the room.',
    };
    const roomMemberEvent: RoomEvent = {
      event_id: generateId(Identifier.EVENT, HostKeyEnum.GOSSY),
      room_id: roomId,
      origin_server_ts: Date.now(),
      sender: context.uuid,
      // In all cases except for when membership is join, the user ID sending the event does not need to match the user ID in the state_key, unlike other events.
      state_key: context.uuid,
      type: RoomEventTypeEnum.Enum['m.room.member'],
      content: roomMemberContent,
    };
    // A default m.room.power_levels event, giving the room creator (and not other members) permission to send state events.
    const roomPowerLevelsContent: RoomPowerLevelsContent = {
      ban: 50,
      events: {},
      events_default: 0,
      invite: 0,
      kick: 50,
      notifications: {
        room: 50,
      },
      redact: 50,
      state_default: 50,
      users: {},
      users_default: 0,
      // Overridden by the power_level_content_override parameter.
      ...body.power_level_content_override,
    };
    const roomPowerLevelsEvent: RoomEvent = {
      type: RoomEventTypeEnum.Enum['m.room.power_levels'],
      content: roomPowerLevelsContent,
    };
    // An m.room.canonical_alias event if room_alias_name is given.
    if (body.room_alias_name) {
      const roomCanonicalAliasContent: RoomCanonicalAliasContent = {
        alias: body.room_alias_name,
        alt_aliases: [],
      };
      const roomCanonicalAliasEvent: RoomEvent = {
        type: RoomEventTypeEnum.Enum['m.room.canonical_alias'],
        content: roomCanonicalAliasContent,
      };
    }
    // Events set by the preset. Currently these are the m.room.join_rules, m.room.history_visibility, and m.room.guest_access state events.
    if (body.preset) {
      const roomJoinRulesContent: RoomJoinRulesContent = {};
      const roomJoinRulesEvent: RoomEvent = {
        type: RoomEventTypeEnum.Enum['m.room.join_rules'],
        content: roomJoinRulesContent,
      };
      const roomHistoryVisibilityContent: HistoryVisibilityContent = {};
      const roomHistoryVisibilityEvent: RoomEvent = {
        type: RoomEventTypeEnum.Enum['m.room.history_visibility'],
        content: roomHistoryVisibilityContent,
      };
      const roomGuestAccessContent: GuestAccessContent = {};
      const roomGuestAccessEvent: RoomEvent = {
        type: RoomEventTypeEnum.Enum['m.room.guest_access'],
        content: roomGuestAccessContent,
      };
    }
    // Events listed in initial_state, in the order that they are listed.
    if (body.initial_state) {
      for (const event of body.initial_state) {
      }
    }
    // Events implied by name and topic (m.room.name and m.room.topic state events).
    if (body.name) {
      const roomNameContent: RoomNameContent = {};
      const roomNameEvent: RoomEvent = {
        type: RoomEventTypeEnum.Enum['m.room.name'],
        content: roomNameContent,
      };
    }
    if (body.topic) {
      const roomTopicContent: RoomTopicContent = {};
      const roomTopicEvent: RoomEvent = {
        type: RoomEventTypeEnum.Enum['m.room.topic'],
        content: roomTopicContent,
      };
    }
    // Invite events implied by invite and invite_3pid (m.room.member with membership: invite and m.room.third_party_invite).
    if (body.invite) {
      const roomMemberContent: RoomMemberContent = {};
      const roomMemberEvent: RoomEvent = {
        type: RoomEventTypeEnum.Enum['m.room.member'],
        content: roomMemberContent,
      };
    }
    if (body.invite_3pid) {
      const roomThirdPartyInviteContent: RoomThirdPartyInviteContent = {};
      const roomThirdPartyInviteEvent: RoomEvent = {
        type: RoomEventTypeEnum.Enum['m.room.third_party_invite'],
        content: roomThirdPartyInviteContent,
      };
    }
  },
);
