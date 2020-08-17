import Koa from 'koa'
import HttpStatus from 'http-status-codes'
import OrderModel from '../models/order.model'

export const getOrder = async (ctx: Koa.Context) => {
  const orderId = ctx.request.URL.searchParams.get("id");
  const data = await OrderModel.findOne({ _id: orderId }).exec()

  if (!data) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    ctx.body = data
    ctx.status = HttpStatus.OK
  }
}

export const getOrders = async (ctx: Koa.Context) => {
  const { page = 1, limit = 10, name } = ctx.request.query;
  const data = await OrderModel.find({ name })
  .sort({ updatedAt: -1 })
  .skip(page * limit)
  .limit(limit)
  .exec()

  if (!data.length) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    const count = await OrderModel.countDocuments({}).exec()
    ctx.body = {
      data: data,
      meta: {
        total: count,
        page: page,
        pageSize: data.length,
      }
    }
  }
}

export const createOrder = async (ctx: Koa.Context) => {
  const data = ctx.body;
  await OrderModel.create(data);
  ctx.status = 200
}

export const updateOrder = async (ctx: Koa.Context) => {
  const orderId = ctx.request.URL.searchParams.get("id");
  const data = ctx.body;
  await OrderModel.findByIdAndUpdate(orderId, data).exec();
  ctx.status = 200
}

export const deleteOrder = async (ctx: Koa.Context) => {
  const orderId = ctx.request.URL.searchParams.get("id");
  if(orderId) {
    await OrderModel.deleteOne({ _id: orderId }).exec();
    ctx.status = 200
  }
}
