import Koa from 'koa';

const app = new Koa();

app.listen(3000, async () => {
  console.log('http://localhost:3000');
});
