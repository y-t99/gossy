import * as Koa from 'koa';
import { PipeSchema } from '../types';

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
    } catch (e: any) {
      e.statusCode = 400;
      throw e;
    }
    await next();
  };
};
