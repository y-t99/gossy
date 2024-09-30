import * as Koa from 'koa';
import { PipeSchema } from '../types';
import { ZodError } from 'zod';
import { ErrcodeEnum } from '../enums';
import { getZodErrorMessage } from '../helpers';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const pipeMiddleware = (schema: PipeSchema): Koa.Middleware => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      if (schema.path) {
        const paramsObject = ctx.params;
        await schema.path.parse(paramsObject);
      }
      if (schema.query) {
        const queryObject = ctx.query;
        await schema.query.parse(queryObject);
      }
      if (schema.body) {
        const bodyObject = ctx.request.body;
        await schema.body.parse(bodyObject);
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
