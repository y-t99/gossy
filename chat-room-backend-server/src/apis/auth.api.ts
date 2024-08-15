import Router from '@koa/router';
import { pipeMiddleware } from '../middlewares';
import { signinRoSchema } from './ros/sign-in.ro';

export const authApis = new Router();

authApis.post(
  '/auths/signin',
  pipeMiddleware({ body: signinRoSchema }),
  async () => {},
);
