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
import {
  MatrixSigninRequestBodyRo,
  matrixSigninRequestBodyRoSchema,
  MatrixSignupRequestBodyRo,
  matrixSignupRequestBodyRoSchema,
  MatrixSignupRequestParamsRo,
  matrixSignupRequestParamsRoSchema,
  signinRoSchema,
  SignupKind,
  signupRoSchema,
} from './ros';
import {
  getSupportedLoginTypes,
  signinByEmailAndPassword,
  signupByEmailAndPassword,
} from '../services';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { AuthenticationType } from '../domains';
import { prisma } from '../dbs';
import { ErrcodeEnum, ErrorMessageEnum, HostKey, Identifier } from '../enums';
import { isValidId } from '../utils';
import { HttpException } from '../exceptions';

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

/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#post_matrixclientv3register
 */
authApis.get(
  '/_matrix/client/v3/register',
  pipeMiddleware({
    query: matrixSignupRequestParamsRoSchema,
    body: matrixSignupRequestBodyRoSchema,
  }),
  async (ctx) => {
    const query = ctx.request.query as MatrixSignupRequestParamsRo;
    const body = ctx.request.body as MatrixSignupRequestBodyRo;
    if (query.kind === SignupKind.USER) {
      if (
        !body.username ||
        isValidId(Identifier.USER, body.username, HostKey.GOSSY)
      ) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          ErrcodeEnum.M_INVALID_USERNAME,
          ErrorMessageEnum.M_INVALID_USERNAME,
        );
      }
      const user = await prisma.user.count({
        where: {
          name: body.username,
        },
      });
      if (user) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          ErrcodeEnum.M_USER_IN_USE,
          ErrorMessageEnum.M_USER_IN_USE,
        );
      }
    }
  },
);

/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#get_matrixclientv3login
 */
authApis.get('/_matrix/client/v3/login', (ctx) => {
  ctx.status = StatusCodes.OK;
  ctx.message = ReasonPhrases.OK;
  ctx.body = {
    flows: getSupportedLoginTypes(),
  };
});

/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#post_matrixclientv3login
 */
authApis.post(
  '/_matrix/client/v3/login',
  pipeMiddleware({ body: matrixSigninRequestBodyRoSchema }),
  async (ctx) => {
    const body = ctx.request.body as MatrixSigninRequestBodyRo;
    if (body.type === AuthenticationType.PASSWORD) {
      if (body.identifier.type === Identifier.USER) {
        if (!body.password) {
          throw new HttpException(
            StatusCodes.FORBIDDEN,
            ErrcodeEnum.M_FORBIDDEN,
            ErrorMessageEnum.M_FORBIDDEN,
          );
        }
        const jwt = await signinByEmailAndPassword(
          body.identifier.user,
          body.password,
        );
        ctx.status = StatusCodes.OK;
        ctx.message = ReasonPhrases.OK;
        ctx.cookies.set('gossy-auth.session-token', jwt, { httpOnly: true });
        return;
      }
    }
  },
);

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
