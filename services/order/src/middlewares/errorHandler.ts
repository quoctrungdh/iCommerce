import HttpStatus from 'http-status-codes';
import Koa from 'koa';

export default async function errorHandler(
  ctx: Koa.Context,
  next: Koa.Next,
) {
  try {
    await next();
  } catch (error) {
    ctx.status =
      error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
}
