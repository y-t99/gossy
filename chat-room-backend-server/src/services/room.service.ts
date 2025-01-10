import { Prisma, RoomMembership, User } from '@prisma/client';

import { checkIdFormat, generateId } from '../utils';
import { prisma } from '../dbs';
import {
  Identifier,
  HostKey,
  ErrcodeEnum,
  ErrorMessageEnum,
  RoomVersion,
  RoomEventType,
  RoomMembershipStates,
  RoomJoinRules,
  HistoryVisibility,
  GuestAccess,
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
  RoomTopicContent,
} from '../domains';
import { StatusCodes } from 'http-status-codes';
import {
  HttpException,
  ResourceNotFound,
  RoomAliasConflict,
  RoomAliasInvalid,
  RoomAliasNotFound,
} from '../exceptions';
import { CreateRoomDto } from '../dtos';
import util from 'node:util';

export async function createRoom(dto: CreateRoomDto, userId: number) {
  const originServerTs = new Date().toISOString();
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      uuid: true,
      name: true,
      image: true,
      phoneNumber: true,
      email: true,
    },
  });
  if (!user) {
    throw new HttpException(
      StatusCodes.NOT_FOUND,
      ErrcodeEnum.M_NOT_FOUND,
      ErrorMessageEnum.M_NOT_FOUND,
    );
  }
  const roomId = generateId(Identifier.ROOM, HostKey.GOSSY);
  const effects = createRoomEffects(roomId, dto, user);
  await prisma.$transaction([
    prisma.room.create({
      data: {
        uuid: roomId,
        name: dto.name,
        alias: dto.room_alias_name,
        version: dto.room_version ?? RoomVersion.V11,
        type: dto.preset ?? 'public_chat',
        // todo: room avatar
        avatar: null,
        joinRules:
          dto.preset === 'public_chat'
            ? RoomJoinRules.PUBLIC
            : RoomJoinRules.INVITE,
        topic: dto.topic,
        visibility: dto.visibility === 'public' ? true : false,
        creator: user.uuid,
      },
    }),
    prisma.event.createMany({
      data: effects.map((effect) => ({
        uuid: effect.event_id,
        roomId: effect.room_id,
        sender: effect.sender,
        type: effect.type,
        content: effect.content,
        stateKey: effect.state_key,
        unsigned: effect.unsigned,
        originServerTs,
      })),
    }),
  ]);
}

function createRoomEffects(
  roomId: string,
  dto: CreateRoomDto,
  user: Pick<User, 'id' | 'uuid' | 'name' | 'image' | 'phoneNumber' | 'email'>,
) {
  const effects: RoomEvent[] = [];
  const getEventBase = () => {
    return {
      event_id: generateId(Identifier.EVENT, HostKey.GOSSY),
      room_id: roomId,
      origin_server_ts: Date.now(),
      sender: user.uuid,
    };
  };
  // The m.room.create event itself. Must be the first event in the room.
  const roomCreateContent: RoomCreateContent = {
    creator: user.uuid,
    room_version: dto.room_version ?? RoomVersion.V11,
    'm.federate': dto.creation_content?.['m.federate'] ?? false,
    predecessor: dto.creation_content?.predecessor,
    type: dto.creation_content?.type,
  };
  const roomCreateEvent: RoomEvent = {
    ...getEventBase(),
    type: RoomEventType.ROOM_CREATE,
    content: roomCreateContent,
  };
  effects.push(roomCreateEvent);
  // An m.room.member event for the creator to join the room. This is needed so the remaining events can be sent.
  const roomMemberContent: RoomMemberContent = {
    avatar_url: user.image,
    displayname: user.name,
    is_direct: dto.is_direct ?? false,
    membership: RoomMembershipStates.JOIN,
    join_authorised_via_users_server: HostKey.GOSSY,
    reason: 'An m.room.member event for the creator to join the room.',
  };
  const roomMemberEvent: RoomEvent = {
    ...getEventBase(),
    // In all cases except for when membership is join, the user ID sending the event does not need to match the user ID in the state_key, unlike other events.
    state_key: user.uuid,
    type: RoomEventType.ROOM_MEMBER,
    content: roomMemberContent,
  };
  effects.push(roomMemberEvent);
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
    ...dto.power_level_content_override,
  };
  const roomPowerLevelsEvent: RoomEvent = {
    ...getEventBase(),
    type: RoomEventType.ROOM_POWER_LEVELS,
    content: roomPowerLevelsContent,
  };
  effects.push(roomPowerLevelsEvent);
  // An m.room.canonical_alias event if room_alias_name is given.
  if (dto.room_alias_name) {
    const roomCanonicalAliasContent: RoomCanonicalAliasContent = {
      alias: dto.room_alias_name,
      alt_aliases: [],
    };
    const roomCanonicalAliasEvent: RoomEvent = {
      ...getEventBase(),
      type: RoomEventType.ROOM_CANONICAL_ALIAS,
      content: roomCanonicalAliasContent,
    };
    effects.push(roomCanonicalAliasEvent);
  }
  // Events set by the preset. Currently these are the m.room.join_rules, m.room.history_visibility, and m.room.guest_access state events.
  if (dto.preset) {
    const roomJoinRulesContent: RoomJoinRulesContent = {
      join_rule:
        dto.preset === 'public_chat'
          ? RoomJoinRules.PUBLIC
          : RoomJoinRules.INVITE,
      allow: [],
    };
    const roomJoinRulesEvent: RoomEvent = {
      ...getEventBase(),
      type: RoomEventType.ROOM_JOIN_RULES,
      content: roomJoinRulesContent,
    };
    effects.push(roomJoinRulesEvent);
    const roomHistoryVisibilityContent: HistoryVisibilityContent = {
      history_visibility: HistoryVisibility.SHARED,
    };
    const roomHistoryVisibilityEvent: RoomEvent = {
      ...getEventBase(),
      type: RoomEventType.ROOM_HISTORY_VISIBILITY,
      content: roomHistoryVisibilityContent,
    };
    effects.push(roomHistoryVisibilityEvent);
    const roomGuestAccessContent: GuestAccessContent = {
      guest_access:
        dto.preset === 'public_chat'
          ? GuestAccess.FORBIDDEN
          : GuestAccess.CAN_JOIN,
    };
    const roomGuestAccessEvent: RoomEvent = {
      ...getEventBase(),
      type: RoomEventType.ROOM_GUEST_ACCESS,
      content: roomGuestAccessContent,
    };
    effects.push(roomGuestAccessEvent);
  }
  // Events listed in initial_state, in the order that they are listed.
  if (dto.initial_state) {
    for (const event of dto.initial_state) {
      effects.push({
        ...getEventBase(),
        type: event.type,
        content: event.content,
        state_key: event.state_key,
      });
    }
  }
  // Events implied by name and topic (m.room.name and m.room.topic state events).
  if (dto.name) {
    const roomNameContent: RoomNameContent = {
      name: dto.name,
    };
    const roomNameEvent: RoomEvent = {
      ...getEventBase(),
      type: RoomEventType.ROOM_NAME,
      content: roomNameContent,
    };
    effects.push(roomNameEvent);
  }
  if (dto.topic) {
    const roomTopicContent: RoomTopicContent = {
      topic: dto.topic,
    };
    const roomTopicEvent: RoomEvent = {
      ...getEventBase(),
      type: RoomEventType.ROOM_TOPIC,
      content: roomTopicContent,
    };
    effects.push(roomTopicEvent);
  }
  // Invite events implied by invite and invite_3pid (m.room.member with membership: invite and m.room.third_party_invite).
  if (dto.invite) {
    for (const uuid of dto.invite) {
      const roomMemberContent: RoomMemberContent = {
        avatar_url: user.image,
        displayname: user.name,
        membership: RoomMembershipStates.INVITE,
        is_direct: dto.is_direct ?? false,
        join_authorised_via_users_server: HostKey.GOSSY,
        reason: 'Invite events implied by invite.',
      };
      const roomMemberEvent: RoomEvent = {
        ...getEventBase(),
        state_key: uuid,
        type: RoomEventType.ROOM_MEMBER,
        content: roomMemberContent,
      };
      effects.push(roomMemberEvent);
    }
  }
  // todo: invite_3pid
  return effects;
}

export async function getRoomByAlias(alias: string) {
  if (!checkIdFormat(Identifier.ROOM_ALIAS, alias)) {
    throw new HttpException(
      StatusCodes.BAD_REQUEST,
      ErrcodeEnum.M_INVALID_PARAM,
      RoomAliasInvalid,
    );
  }
  const room = await prisma.room.findUnique({
    where: {
      alias,
    },
    select: {
      uuid: true,
    },
  });
  if (!room) {
    throw new HttpException(
      StatusCodes.NOT_FOUND,
      ErrcodeEnum.M_NOT_FOUND,
      util.format(RoomAliasNotFound, alias),
    );
  }
  return {
    room_id: room.uuid,
    servers: [HostKey.GOSSY],
  };
}

export async function updateRoomAlias(
  userUuid: string,
  uuid: string,
  alias: string,
) {
  if (!checkIdFormat(Identifier.ROOM_ALIAS, alias)) {
    throw new HttpException(
      StatusCodes.BAD_REQUEST,
      ErrcodeEnum.M_INVALID_PARAM,
      RoomAliasInvalid,
    );
  }

  try {
    await prisma.room.update({
      where: {
        uuid: uuid,
        creator: userUuid,
      },
      data: {
        alias: alias,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new HttpException(
          StatusCodes.CONFLICT,
          ErrcodeEnum.M_UNKNOWN,
          util.format(RoomAliasConflict, alias),
        );
      }
    }
    throw new HttpException(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ErrcodeEnum.M_UNKNOWN,
      ErrorMessageEnum.M_UNKNOWN,
    );
  }
}

export async function removeRoomAlias(userUuid: string, alias: string) {
  try {
    await prisma.room.update({
      where: {
        alias,
        creator: userUuid,
      },
      data: {
        alias: null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new HttpException(
          StatusCodes.NOT_FOUND,
          ErrcodeEnum.M_NOT_FOUND,
          util.format(RoomAliasNotFound, alias),
        );
      }
    }
    throw new HttpException(
      StatusCodes.INTERNAL_SERVER_ERROR,
      ErrcodeEnum.M_UNKNOWN,
      ErrorMessageEnum.M_UNKNOWN,
    );
  }
}

export async function getRoomAliases(userUuid: string, uuid: string) {
  const room = await prisma.room.findUnique({
    where: {
      uuid,
      creator: userUuid,
    },
    select: {
      alias: true,
    },
  });
  if (!room) {
    throw new HttpException(
      StatusCodes.NOT_FOUND,
      ErrcodeEnum.M_NOT_FOUND,
      util.format(ResourceNotFound, 'Room'),
    );
  }
  return room.alias ? [room.alias] : [];
}

export async function getUserJoinedRooms(userUuid: string) {
  const rooms = await prisma.roomMember.findMany({
    where: {
      userId: userUuid,
      membership: RoomMembership.JOINED,
    },
    select: {
      roomId: true,
    },
  });

  return rooms.map((room) => room.roomId);
}

export async function inviteRoomMember(
  userId: string,
  roomId: string,
  invitedUserId: string,
  reason?: string,
) {}
