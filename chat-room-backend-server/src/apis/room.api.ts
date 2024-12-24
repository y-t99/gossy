import Router from '@koa/router';
import { pipeMiddleware } from '../middlewares';
import { CreateRoomRo, createRoomRoSchema } from './ros';
import { Context } from 'koa';
import { createRoom } from '../services';

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

    const room = await createRoom(body, context);
  },
);
