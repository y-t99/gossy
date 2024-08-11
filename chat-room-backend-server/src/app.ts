import Koa from 'koa';
import {getLogger} from "./helpers";
import {errorHandler} from "./middlewares";

const app = new Koa();

// error handler
app.use(errorHandler);

const logger = getLogger();

app.listen(3000, async () => {
  logger.info('http://localhost:3000');
});
