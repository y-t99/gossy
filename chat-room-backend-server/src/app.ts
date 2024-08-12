import Koa from 'koa';
import { getLogger } from './helpers';
import { errorHandler } from './middlewares';
import Router from '@koa/router';
import koaBody from 'koa-body';

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

app.use(routers.routes()).use(routers.allowedMethods());

app.listen(3000, async () => {
  logger.info('http://localhost:3000');
});
