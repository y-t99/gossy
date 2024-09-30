import Router from '@koa/router';
import { pipeMiddleware } from '../middlewares';
import { signinRoSchema } from './ros/sign-in.ro';
import { signinByEmailAndPassword } from '../services';

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
