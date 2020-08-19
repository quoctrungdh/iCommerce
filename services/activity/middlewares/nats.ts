import { connect, Payload } from "ts-nats";
import Koa from "koa";
import { NATS_SERVER } from "../constants";
import activityModel from "../models/activity.model";
import logger from "../helpers/logger";

export default async (ctx: Koa.Context, next: Koa.Next) => {
  const servers = NATS_SERVER.split(",");

  if(!ctx.state.natsClient) {
    let nc = await connect({ servers, payload: Payload.JSON });
    ctx.state.natsClient = nc;

    nc.subscribe("product.activity", async (err, msg) => {
      if (err) {
        logger.error(err);
      } else {
        try {
          logger.info(
            "product.activity: message received on",
            msg.subject,
            JSON.stringify(msg.data)
          );
          await activityModel.create({
            type: msg.data.type, 
            host: msg.data.host, 
            userAgent: msg.data.userAgent, 
            ip: msg.data.ip,
            data: JSON.stringify(msg.data.data)
          });
        } catch (error) {
          logger.debug(error);
        }
      }
    });
  }
  await next();
};
