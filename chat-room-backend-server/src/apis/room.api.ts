import Router from '@koa/router';
import { pipeMiddleware } from '../middlewares';
import { createRoomRoSchema } from './ros/create-room.ro';

export const roomApis = new Router();

/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#post_matrixclientv3createroom
 */
roomApis.post(
  '/_matrix/client/v3/createRoom',
  pipeMiddleware({
    body: createRoomRoSchema,
  }),
  async () => {},
);
