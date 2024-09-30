import Koa from 'koa';
import { StandardErrorResponseSchema } from '../domains';
import { ErrcodeEnum } from '../enums';
import { getErrorMessage, getLogger } from '../helpers';

/**
 * Similarly, all endpoints require the server to return a JSON object, with the exception of 200 responses to the media download endpoints in the Content Repository module.
 * Servers must include a Content-Type header of application/json for all JSON responses.
 *
 * Any errors which occur at the Matrix API level MUST return a “standard error response”. This is a JSON object which looks like:
 * ```json
 * {
 *   "errcode": "<error code>",
 *   "error": "<error message>"
 * }
 * ```
 */
export const errorHandler = async (ctx: Koa.Context, next: Koa.Next) => {
  const logger = getLogger();
  try {
    await next();
  } catch (err: unknown) {
    const parseResult = StandardErrorResponseSchema.safeParse(ctx.body);
    if (!parseResult.success) {
      ctx.body = {
        errcode: ErrcodeEnum.M_UNKNOWN,
        error: getErrorMessage(err),
      };
    }
    logger.error(err);
  }
};
