import Koa from 'koa'
import logger from '../../helpers/logger';

export const ACTIVITY_SERVICE_CREATE = 'ACTIVITY_SERVICE_CREATE';
export enum ACTIVITY_TYPES {
  VIEW = "VIEW",
  SEARCH = "SEARCH",
  BUY = "BUY"
}

function publisherActivityCreate(type: ACTIVITY_TYPES, data: any, ctx: Koa.Context) {
  return (nc: any) => {
    logger.info("PUSHING...", ACTIVITY_SERVICE_CREATE,type, data)
    if(nc) {
      nc.publish(ACTIVITY_SERVICE_CREATE, {
        type,
        data,
        userAgent: ctx.headers["user-agent"],
        host: ctx.headers['x-forwarded-host'],
        ip: ctx.headers['x-forwarded-for'],
        port: ctx.headers['x-forwarded-port'],
        prefix: ctx.headers['x-forwarded-prefix'],
        protocol: ctx.headers['x-forwarded-proto'],
      });
    }
  }
}

export default publisherActivityCreate

