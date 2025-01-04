import Router from '@koa/router';
import { Context } from 'koa';
import { pipeMiddleware } from '../middlewares';
import { SyncEventRo, syncEventRoSchema } from './ros';
import { getClientEventsSince } from '../services';

export const eventApis = new Router();

/**
 * The first call the /sync API without a since parameter.
 *
 * The response contains `next_batch` and `prev_batch`.
 * - next_batch should be used as the value of the since parameter in the next call to /sync.
 * - prev_batch  can be passed as a start parameter to the /rooms/<room_id>/messages API to retrieve earlier messages.
 *
 * Rate-limited: no
 * Requires authentication: yes
 * @see https://spec.matrix.org/v1.13/client-server-api/#syncing
 */
eventApis.get(
  '/_matrix/client/v3/sync',
  pipeMiddleware({
    query: syncEventRoSchema,
  }),
  async (ctx: Context) => {
    const body: SyncEventRo = ctx.request.query;
    const client = ctx.context.uuid;
    const _ = await getClientEventsSince(client, body.since);
  },
);
