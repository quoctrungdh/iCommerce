import { connect, NatsConnectionOptions, Payload } from "ts-nats";
import Koa from "koa";
import HttpStatus from "http-status-codes";
import { NATS_SERVER } from "../constants";

export default async (ctx: Koa.Context, next: Koa.Next) => {
  if (!NATS_SERVER) {
    ctx.throw(HttpStatus.SERVICE_UNAVAILABLE);
  } else {
    const servers = NATS_SERVER.split(",");
    let nc = await connect({ servers, payload: Payload.JSON });
    ctx.state.natsClient = nc;

    await nc.subscribe("activity.create", (err, msg) => {
      if (err) {
        ctx.throw(HttpStatus.BAD_REQUEST, err)
      } else {
        console.log("message received on", msg.subject, ":", JSON.stringify(msg.data));
      }
    });

    await next();
  }
};
