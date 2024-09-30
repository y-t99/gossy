import * as Koa from 'koa';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ErrcodeEnum } from '../enums';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
});

export const rateLimiterMiddleware = async (
  ctx: Koa.Context,
  next: Koa.Next,
) => {
  return rateLimiter
    .consume(ctx.ip)
    .then(() => next())
    .catch((rateLimiterRes) => {
      ctx.status = StatusCodes.TOO_MANY_REQUESTS;
      ctx.message = ReasonPhrases.TOO_MANY_REQUESTS;
      ctx.body = {
        errcode: ErrcodeEnum.M_LIMIT_EXCEEDED,
        error: JSON.stringify({
          retryAfter: rateLimiterRes.msBeforeNext / 1000,
          rateLimitLimit: rateLimiter.points,
          rateLimitRemaining: rateLimiterRes.remainingPoints,
          rateLimitReset: new Date(Date.now() + rateLimiterRes.msBeforeNext),
        }),
        retry_after_ms: rateLimiterRes.msBeforeNext / 1000,
      };
    });
};
