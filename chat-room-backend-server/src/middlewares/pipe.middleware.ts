import * as Koa from 'koa';
import { PipeSchema } from '../types';
import { ZodError } from 'zod';
import { ErrcodeEnum } from '../enums';
import { getZodErrorMessage } from '../helpers';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const pipeMiddleware = (
  schema: PipeSchema,
): Koa.Middleware<Koa.DefaultState, Koa.Context> => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      if (schema.path) {
        const paramsObject = ctx.params;
        const parsed = await schema.path.parse(paramsObject);
        ctx.params = parsed;
      }
      if (schema.query) {
        const queryObject = ctx.query;
        const parsed = await schema.query.parse(queryObject);
        ctx.query = parsed;
      }
      if (schema.body) {
        const bodyObject = ctx.request.body;
        const parsed = await schema.body.parse(bodyObject);
        ctx.request.body = parsed;
      }
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        ctx.status = StatusCodes.BAD_REQUEST;
        ctx.message = ReasonPhrases.BAD_REQUEST;
        ctx.body = {
          errcode: ErrcodeEnum.M_INVALID_PARAM,
          error: getZodErrorMessage(e),
        };
        return;
      }
      throw e;
    }
    await next();
  };
};
