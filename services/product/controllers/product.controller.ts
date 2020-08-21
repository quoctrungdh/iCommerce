import Koa from "koa";
import HttpStatus from "http-status-codes";
import logger from '../helpers/logger'
import ProductModel from "../models/product.model";
import { ACTIVITY_TYPES } from "../events/publisher/activity-create";
import publisherActivityCreate from "../events/publisher/activity-create";

export const ping = async (ctx: Koa.Context) => {
  ctx.status = HttpStatus.OK;
};

export const getProduct = async (ctx: Koa.Context) => {
  const productId = ctx.request.URL.searchParams.get("id");

  if(!productId) {
    ctx.throw(HttpStatus.BAD_REQUEST, "productId is missing")
  }

  const product = await ProductModel.findOne({ _id: productId });

  if (!product) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    ctx.state.natsPublishByFunc(publisherActivityCreate(ACTIVITY_TYPES.VIEW, product, ctx))
    ctx.body = product;
    ctx.status = 200;
  }
};

export const getProducts = async (ctx: Koa.Context) => {
  const { page: _page , limit: _limit, ...query } = ctx.request.query;

  const page = parseInt(_page) || 0;
  const limit = parseInt(_limit) || 3;

  if (query) {
    ctx.state.natsPublishByFunc(publisherActivityCreate(ACTIVITY_TYPES.SEARCH, ctx.request.query, ctx))
  }

  const products = await ProductModel.find(query)
    .sort({ updatedAt: -1 })
    .skip(page * limit)
    .limit(limit);

  if (!products.length) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    const count = await ProductModel.countDocuments({}).exec();
    ctx.body = {
      data: products,
      meta: {
        total: count,
        page: page,
        pageSize: products.length,
      },
    };
  }
};

export const createProduct = async (ctx: Koa.Context) => {
  const data = ctx.request.body;
  if(!data) {
    ctx.throw(HttpStatus.BAD_REQUEST, "data is missing")
  }
  logger.info("createProduct", JSON.stringify(data))
  await ProductModel.create(data)
  ctx.status = 200;
};

export const updateProduct = async (ctx: Koa.Context) => {
  const productId = ctx.request.URL.searchParams.get("id");
  const data = ctx.request.body;
  if(!productId) {
    ctx.throw(HttpStatus.BAD_REQUEST, "productId is missing")
  }

  if(!data) {
    ctx.throw(HttpStatus.BAD_REQUEST, "data is missing")
  }
  await ProductModel.findByIdAndUpdate(productId, data).exec();
  ctx.status = 200;
};

export const deleteProduct = async (ctx: Koa.Context) => {
  const productId = ctx.request.URL.searchParams.get("id");
  if(!productId) {
    ctx.throw(HttpStatus.BAD_REQUEST, "productId is missing")
  }
  
  await ProductModel.deleteOne({ _id: productId }).exec();
  ctx.status = 200;
};
