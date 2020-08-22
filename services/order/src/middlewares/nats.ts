import { connect, Payload, Client } from 'ts-nats';
import Koa from 'koa';
import { NATS_SERVER } from '../constants';
import logger from '../helpers/logger';

export default async (ctx: Koa.Context, next: Koa.Next) => {
  const servers = NATS_SERVER.split(',');

  if (!ctx.state.natsClient) {
    const nc: Client = await connect({ servers, payload: Payload.JSON });
    // connect will happen once - the first connect
    nc.on('connect', () => {
      // nc is the connection that connected
      logger.info('client connected');
    });

    nc.on('disconnect', (url) => {
      // nc is the connection that reconnected
      logger.info('disconnected from', url);
    });

    nc.on('reconnecting', (url) => {
      logger.info('reconnecting to', url);
    });

    nc.on('reconnect', (_, url) => {
      // nc is the connection that reconnected
      logger.info('reconnected to', url);
    });
    ctx.state.natsClient = nc;
  }
  await next();
};
