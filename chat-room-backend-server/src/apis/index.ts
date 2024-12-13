import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import Router from '@koa/router';
import { Role } from '../enums';

export * from './auth.api';

export const rootRouter = new Router();

/**
 *
 * Rate-limited:	No
 * Requires authentication:	No
 *
 * @see https://spec.matrix.org/v1.12/client-server-api/#well-known-uri
 */
rootRouter.get('/.well-known/matrix/client', (ctx) => {
  ctx.status = StatusCodes.OK;
  ctx.message = ReasonPhrases.OK;
  ctx.body = {
    'm.homeserver': {
      base_url: '',
    },
    'm.identity_server': {
      base_url: '',
    },
    'com.gossy.property': {
      message: 'hello',
    },
  };
});

rootRouter.get('/_matrix/client/versions', (ctx) => {
  ctx.status = StatusCodes.OK;
  ctx.message = ReasonPhrases.OK;
  ctx.body = {
    unstable_features: {},
    versions: ['v1.12.0'],
  };
});

rootRouter.get('/.well-known/matrix/support ', (ctx) => {
  ctx.status = StatusCodes.OK;
  ctx.message = ReasonPhrases.OK;
  ctx.body = {
    contacts: [
      {
        email_address: 'support@gossy.com',
        role: Role.ADMIN,
      },
    ],
    support_page: '',
  };
});
