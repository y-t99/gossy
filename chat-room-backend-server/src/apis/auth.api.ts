/**
 * matrix homeserver api
 *
 * A homeserver is a piece of software hosting accounts of Matrix users.
 * It is bound to a single domain that cannot change over time.
 * The accounts on a server have an identifier made of a local part (the username), and a server part, which is the (vanity) domain of the homeserver.
 * A typical identifier would be `@username:example.com`.
 */

import Router from '@koa/router';
import { pipeMiddleware } from '../middlewares';
import { signinRoSchema, signupRoSchema } from './ros';
import {
  signinByEmailAndPassword,
  signupByEmailAndPassword,
} from '../services';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { AuthenticationType } from 'src/domains';

export const authApis = new Router();

/**
 * Gets the homeserver’s supported login types to authenticate users.
 * Clients should pick one of these and supply it as the type when logging in.
 *
 * @see https://spec.matrix.org/v1.12/client-server-api/#get_matrixclientv3login
 */
authApis.get('/_matrix/client/v3/login', async (ctx) => {
  ctx.status = StatusCodes.OK;
  ctx.message = ReasonPhrases.OK;
  ctx.body = {
    flows: [
      {
        type: AuthenticationType.PASSWORD,
      },
      {
        get_login_token: true,
        type: AuthenticationType.TOKEN,
      },
    ],
  };
});

authApis.post(
  '/auths/signin',
  pipeMiddleware({ body: signinRoSchema }),
  async (ctx) => {
    const { email, password } = ctx.request.body;
    const jwt = await signinByEmailAndPassword(email, password);
    ctx.cookies.set('gossy-auth.session-token', jwt, { httpOnly: true });
  },
);

authApis.post(
  '/auths/signup',
  pipeMiddleware({ body: signupRoSchema }),
  async (ctx) => {
    const { email, password } = ctx.request.body;
    // todo: check code, password, email
    const jwt = await signupByEmailAndPassword(email, password);
    ctx.cookies.set('gossy-auth.session-token', jwt, { httpOnly: true });
  },
);
