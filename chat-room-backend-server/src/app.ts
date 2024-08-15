import Koa from 'koa';
import { getLogger } from './helpers';
import { errorHandler } from './middlewares';
import Router from '@koa/router';
import koaBody from 'koa-body';
import { authApis } from './apis';

const app = new Koa();

// error handler
app.use(errorHandler);

const logger = getLogger();

// body parsing
app.use(
  koaBody({
    multipart: true,
  }),
);

export const routers: Router = new Router();

for (const router of [authApis]) {
  routers.use(router.routes());
  routers.use(router.allowedMethods());
}

app.use(routers.routes()).use(routers.allowedMethods());

app.listen(3000, async () => {
  logger.info('http://localhost:3000');
});
