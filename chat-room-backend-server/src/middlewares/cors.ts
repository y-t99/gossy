import * as Koa from 'koa';
import { HttpMethods } from '../enums';
import { z } from 'zod';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const vary = require('vary');

const _corsOptionsSchema = z.object({
  allowMethods: z.union([z.array(z.string()), z.string()]).optional(),
  exposeHeaders: z.union([z.array(z.string()), z.string()]).optional(),
  allowHeaders: z.union([z.array(z.string()), z.string()]).optional(),
  maxAge: z.union([z.string(), z.number()]),
  keepHeadersOnError: z.boolean().optional(),
  secureContext: z.boolean().optional(),
  privateNetworkAccess: z.boolean().optional(),
});

/**
 * @see @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes
 * @see https://wicg.github.io/private-network-access
 */
export type CORSOptions = z.infer<typeof _corsOptionsSchema> & {
  origin?: (_ctx: Koa.Context) => Promise<string | undefined> | string;
  credentials?: (_ctx: Koa.Context) => Promise<boolean | undefined> | boolean;
};

/**
 * CORS middleware
 *
 * @see https://github.com/koajs/cors
 * @param ctx
 * @param next
 */
export const cors = (
  options: CORSOptions,
): Koa.Middleware<Koa.DefaultState, Koa.Context> => {
  const defaultOrigin = '*';
  const defaultAllowMethods = 'GET,HEAD,PUT,POST,DELETE,PATCH';
  // const defaultSecureContext = false;

  return async (ctx: Koa.Context, next: Koa.Next) => {
    if (Array.isArray(options.exposeHeaders)) {
      options.exposeHeaders = options.exposeHeaders.join(',');
    }

    if (Array.isArray(options.allowMethods)) {
      options.allowMethods = options.allowMethods.join(',');
    }

    if (Array.isArray(options.allowHeaders)) {
      options.allowHeaders = options.allowHeaders.join(',');
    }

    const keepHeadersOnError =
      options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

    /**
     * Right now the Vary: Origin response header is only applied when there is an Origin header in the request.
     * I believe this should be considered a bug because conditionally returning the header based on the presence of an Origin will poison intermediate caches (Varnish, Akamai, any CDN, etc).
     *
     * Since you can issue a request without an Origin an intermediate cache will hang on to the return value.
     * Next time when a cross domain request comes in with an Origin the intermediate cache won't know to Vary by Origin and will return the non-CORS response.
     */
    ctx.vary('origin');

    let origin: string | undefined;
    if (typeof options.origin === 'function') {
      origin = await options.origin(ctx);
    } else {
      origin = options.origin || defaultOrigin;
    }

    let credentials: boolean | undefined;
    if (typeof options.credentials === 'function') {
      credentials = await options.credentials(ctx);
    } else {
      credentials = options.credentials;
    }

    /**
     *  If `credentials` set and return `true, the `origin` default value will set to the request `Origin` header
     */
    if (credentials && origin === '*') {
      origin = Array.isArray(ctx.headers['Origin'])
        ? ctx.headers['Origin'].join(' ')
        : ctx.headers['Origin'];
    }

    if (!origin) {
      return await next();
    }

    if (ctx.method === HttpMethods.OPTIONS) {
      // Preflight Request

      // If there is no Access-Control-Request-Method header or if parsing failed,
      // do not set any additional headers and terminate this set of steps.
      // The request is outside the scope of this specification.
      if (!ctx.get('Access-Control-Request-Method')) {
        // this not preflight request, ignore it
        return await next();
      }

      ctx.set('Access-Control-Allow-Origin', origin);

      if (credentials === true) {
        ctx.set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.maxAge) {
        ctx.set('Access-Control-Max-Age', String(options.maxAge));
      }

      if (
        options.privateNetworkAccess &&
        ctx.get('Access-Control-Request-Private-Network')
      ) {
        ctx.set('Access-Control-Allow-Private-Network', 'true');
      }

      if (options.allowMethods) {
        ctx.set('Access-Control-Allow-Methods', options.allowMethods);
      } else {
        ctx.set('Access-Control-Allow-Methods', defaultAllowMethods);
      }

      if (options.secureContext) {
        ctx.set('Cross-Origin-Opener-Policy', 'same-origin');
        ctx.set('Cross-Origin-Embedder-Policy', 'require-corp');
      }

      let allowHeaders = options.allowHeaders;
      if (!allowHeaders) {
        allowHeaders = ctx.get('Access-Control-Request-Headers');
      }

      if (allowHeaders) {
        ctx.set('Access-Control-Allow-Headers', allowHeaders);
      }

      ctx.status = StatusCodes.NO_CONTENT;
      ctx.message = ReasonPhrases.NO_CONTENT;
    } else {
      // Simple Cross-Origin Request, Actual Request, and Redirects
      ctx.set('Access-Control-Allow-Origin', origin);

      if (credentials === true) {
        ctx.set('Access-Control-Allow-Credentials', 'true');
      }

      if (options.exposeHeaders) {
        ctx.set('Access-Control-Expose-Headers', options.exposeHeaders);
      }

      if (options.secureContext) {
        ctx.set('Cross-Origin-Opener-Policy', 'same-origin');
        ctx.set('Cross-Origin-Embedder-Policy', 'require-corp');
      }

      if (keepHeadersOnError) {
        return await next();
      }

      try {
        return await next();
      } catch (err: any) {
        if ('headers' in err) {
          const varyWithOrigin = vary.append(
            err.headers.vary || err.headers.Vary || '',
            'Origin',
          );
          err.headers = {
            ...(err.headers as Record<string, any>),
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': credentials === true,
            'Access-Control-Expose-Headers': options.exposeHeaders,
            ...(options.secureContext
              ? {
                  'Cross-Origin-Opener-Policy': 'same-origin',
                  'Cross-Origin-Embedder-Policy': 'require-corp',
                }
              : null),
            ...{ vary: varyWithOrigin },
          };
        }
        throw err;
      }
    }
  };
};
