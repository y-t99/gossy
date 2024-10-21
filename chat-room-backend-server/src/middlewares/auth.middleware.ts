import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as Koa from 'koa';
import { AuthenticationType } from '../domains';
import { v4 as uuidv4 } from 'uuid';

export const authMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const path = ctx.request.path;
  // Note that this endpoint does not currently use the User-Interactive Authentication API.
  if (path === '/_matrix/client/v3/login') {
    return await next();
  }

  const authHeader = ctx.request.headers.authorization;
  const authParam = ctx.request.query.access_token;
  if (!authHeader && !authParam) {
    ctx.status = StatusCodes.UNAUTHORIZED;
    ctx.message = ReasonPhrases.UNAUTHORIZED;
    ctx.body = {
      flows: [
        {
          stages: [AuthenticationType.TERMS],
        },
      ],
      params: {
        [AuthenticationType.TERMS]: {
          policies: {},
        },
      },
      session: uuidv4(),
    };
    return;
  }
  return await next();
};
