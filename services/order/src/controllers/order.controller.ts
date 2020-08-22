import Koa from 'koa';
import HttpStatus from 'http-status-codes';
import fetch from 'node-fetch';
import OrderModel from '../models/order.model';
import { PRODUCT_SERVICE_URL } from '../constants';
import publisherActivityCreate, { ACTIVITY_TYPES } from '../events/publisher/activity-create';
import logger from '../helpers/logger';

export const ping = async (ctx: Koa.Context) => {
  ctx.status = HttpStatus.OK;
};

export const getOrder = async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  if (!id) {
    ctx.throw(HttpStatus.BAD_REQUEST, 'id is missing');
  } else {
    const data = await OrderModel.findOne({ _id: id });

    if (!data) {
      ctx.throw(HttpStatus.NOT_FOUND);
    } else {
      ctx.body = data;
      ctx.status = 200;
    }
  }
};

export const getOrders = async (ctx: Koa.Context) => {
  const { page: _page, limit: _limit, ...query } = ctx.request.query;
  const page = parseInt(_page) || 0;
  const limit = parseInt(_limit) || 10;

  const data = await OrderModel.find(query)
    .sort({ createdAt: -1 })
    .skip(page * limit)
    .limit(limit);

  const total = await OrderModel.countDocuments({}).exec();
  ctx.body = {
    data,
    meta: {
      total,
      page,
      pageSize: data.length,
    },
  };
};

export const createOrder = async (ctx: Koa.Context) => {
  const data = ctx.request.body;
  logger.info('createOrder', data);
  if (!data.productId) {
    ctx.throw(HttpStatus.BAD_REQUEST, 'productId is missing');
  }

  const resp = await fetch(`${PRODUCT_SERVICE_URL}/${data.productId}`, {
    method: 'GET',
  });

  const result = await resp.json();
  if (!result) {
    ctx.throw(HttpStatus.NOT_FOUND, `productId is not found`);
  }

  const order = {
    totalPrice: result.price * data.quality,
    quality: data.quality,
    productID: result._id,
  };

  ctx.state.natsPublishByFunc(
    publisherActivityCreate(ACTIVITY_TYPES.BUY, order, ctx)
  );

  await OrderModel.create();
  ctx.status = 200;
};

export const updateOrder = async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  const data = ctx.request.body;
  if (!id) {
    ctx.throw(HttpStatus.BAD_REQUEST, 'id is missing');
  } else {
    await OrderModel.findOneAndUpdate({ _id: id }, data).exec();
    ctx.status = 200;
  }
};

export const deleteOrder = async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  if (!id) {
    ctx.throw(HttpStatus.BAD_REQUEST, 'id is missing');
  } else {
    await OrderModel.deleteOne({ _id: id }).exec();
    ctx.status = 200;
  }
};
