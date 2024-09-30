import Router from '@koa/router';
import { pipeMiddleware } from '../middlewares';
import { signinRoSchema, signupRoSchema } from './ros';
import {
  signinByEmailAndPassword,
  signupByEmailAndPassword,
} from '../services';

export const authApis = new Router();

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
