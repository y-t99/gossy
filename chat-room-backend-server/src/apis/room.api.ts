import Router from '@koa/router';
import { pipeMiddleware } from '../middlewares';
import { Context } from 'koa';
import {
  createRoom,
  getRoomAliases,
  getRoomByAlias,
  removeRoomAlias,
  updateRoomAlias,
} from '../services';
import {
  CreateRoomRo,
  createRoomRoSchema,
  RoomAliasPath,
  roomAliasPathSchema,
  RoomAliasRo,
  roomAliasRoSchema,
  RoomRo,
  roomRoSchema,
} from './ros';
import { AliasesVo, AliasInfoVo } from './vos/alias-info.vo';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

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

    const _room = await createRoom(body, context.id);
  },
);

/**
 * @see https://spec.matrix.org/v1.13/client-server-api/#room-aliases
 */
roomApis.get(
  '/_matrix/client/v3/directory/room/:room_alias',
  pipeMiddleware({
    path: roomAliasPathSchema,
  }),
  async (ctx: Context<AliasInfoVo>) => {
    const { room_alias }: RoomAliasPath = ctx.params;
    const aliasInfo = await getRoomByAlias(room_alias);
    ctx.status = StatusCodes.OK;
    ctx.message = ReasonPhrases.OK;
    ctx.body = aliasInfo;
  },
);

roomApis.put(
  '/_matrix/client/v3/directory/room/:room_alias',
  pipeMiddleware({
    path: roomAliasPathSchema,
    body: roomAliasRoSchema,
  }),
  async (ctx: Context) => {
    const { room_alias }: RoomAliasPath = ctx.params;
    const { room_id }: RoomAliasRo = ctx.request.body;
    const context = ctx.context;

    await updateRoomAlias(context.uuid, room_id, room_alias);

    ctx.status = StatusCodes.OK;
    ctx.message = ReasonPhrases.OK;
    ctx.body = {};
  },
);

/**
 * @see https://spec.matrix.org/v1.13/client-server-api/#delete_matrixclientv3directoryroomroomalias
 */
roomApis.delete(
  '/_matrix/client/v3/directory/room/:room_alias',
  pipeMiddleware({
    path: roomAliasPathSchema,
  }),
  async (ctx: Context) => {
    const { room_alias }: RoomAliasPath = ctx.params;
    const context = ctx.context;

    await removeRoomAlias(context.uuid, room_alias);

    ctx.status = StatusCodes.OK;
    ctx.message = ReasonPhrases.OK;
    ctx.body = {};
  },
);

/**
 * Rate-limited:	Yes
 * Requires authentication:	Yes
 * @see https://spec.matrix.org/v1.13/client-server-api/#get_matrixclientv3roomsroomidaliases
 */
roomApis.get(
  '/_matrix/client/v3/rooms/{roomId}/aliases',
  pipeMiddleware({
    path: roomRoSchema,
  }),
  async (ctx: Context<AliasesVo>) => {
    const { room_id }: RoomRo = ctx.params;
    const context = ctx.context;

    const aliases = await getRoomAliases(context.uuid, room_id);

    ctx.status = StatusCodes.OK;
    ctx.message = ReasonPhrases.OK;
    ctx.body = {
      aliases,
    };
  },
);
