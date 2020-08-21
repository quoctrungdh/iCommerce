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
    logger.info("PUSHING...", ACTIVITY_SERVICE_CREATE,type, data )
    if(nc) {
      nc.publish(ACTIVITY_SERVICE_CREATE, {
        type,
        host: ctx.headers.host,
        userAgent: ctx.headers["user-agent"],
        ip: ctx.ips.length > 0 ? ctx.ips[ctx.ips.length - 1] : ctx.ip,
        data
      });
    }
  }
}

export default publisherActivityCreate

