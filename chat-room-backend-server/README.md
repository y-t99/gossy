# Gossy Backend Server

## Middleware

1. Router: koa-router
2. Request Body Parser : koa-body
3. Error Handler: middleware/error-handler
4. Validation & Transformation: middleware/pipe(base on zod)
5. Rate Limiter: middleware/rate-limiter(base on rate-limiter-flexible)

## Request Lifecycle

rate limiter -> koa-body -> pipe -> api handler -> error handler