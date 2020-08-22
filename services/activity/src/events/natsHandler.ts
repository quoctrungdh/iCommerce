import Koa from 'koa';
import { NATS_SERVER } from '../constants';
import { connect, Payload } from 'ts-nats';
import logger from '../helpers/logger';
import { serializeError } from 'serialize-error';
import subscriptionActivityCreate from './subscription/activity-create';

export default class NatsHandler {
  nc: any = {};
  servers: any;

  constructor() {
    this.servers = NATS_SERVER.split(',');
    try {
      this.connectNats();
    } catch (error) {
      logger.error(JSON.stringify(serializeError(error)));
    }
  }

  connectNats = async () => {
    this.nc = await connect({ servers: this.servers, payload: Payload.JSON });
    this.nc.on('connect', () => {
      logger.info('NATS client connected');
    });
    this.nc.on('disconnect', (url: string) => {
      // nc is the connection that reconnected
      logger.info('NATS client disconnected from', url);
    });

    this.nc.on('reconnecting', (url: string) => {
      logger.info('NATS client reconnecting to', url);
    });

    this.nc.on('reconnect', (nc: any, url: string) => {
      // nc is the connection that reconnected
      logger.info('NATS client reconnected to', url);
    });
    subscriptionActivityCreate(this.nc);
  };

  natsMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.state.natsClient = this.nc;
    ctx.state.natsPublishByFunc = this.natsPublishByFunc;
    await next();
  };

  natsPublishByFunc = async (func: Function) => {
    return func(this.nc);
  };
}
