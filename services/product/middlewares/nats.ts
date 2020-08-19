import {connect, NatsConnectionOptions, Payload} from 'ts-nats';
import Koa from 'koa'
import HttpStatus from 'http-status-codes'
import { NATS_SERVER } from '../constants'

export default async (ctx: Koa.Context, next: Koa.Next) => {
  if(!NATS_SERVER) {
    ctx.throw(HttpStatus.SERVICE_UNAVAILABLE)
  } else {
    const servers = NATS_SERVER.split(',')
    let nc = await connect({ servers, payload: Payload.JSON });
    ctx.state.natsClient = nc

    await next()
  }
  
}