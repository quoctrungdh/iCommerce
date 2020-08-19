import { connect, Payload } from "ts-nats";
import Koa from "koa";
import { NATS_SERVER } from "../constants";
import logger from "../helpers/logger";

export default async (ctx: Koa.Context, next: Koa.Next) => {
  const servers = NATS_SERVER.split(",");

  if(!ctx.state.natsClient) {
    let nc = await connect({ servers, payload: Payload.JSON });
    ctx.state.natsClient = nc;
  }
  await next();
};
