import Koa from "koa";
import HttpStatus from "http-status-codes";
import logger from '../helpers/logger'
import ProductModel from "../models/product.model";

export const ping = async (ctx: Koa.Context) => {
  ctx.status = HttpStatus.OK;
};

export const getProduct = async (ctx: Koa.Context) => {
  const productId = ctx.request.URL.searchParams.get("id");

  const product = await ProductModel.findOne({ _id: productId });

  if (!product) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    const { natsClient } = ctx.state;
    if (productId) {
      natsClient.publish("activity.create", {
        type: "VIEW",
        host: ctx.headers.host,
        userAgent: ctx.headers["user-agent"],
        ip: ctx.ips.length > 0 ? ctx.ips[ctx.ips.length - 1] : ctx.ip,
        data: {
          productId,
        },
      });
    }
    ctx.body = product;
    ctx.status = 200;
  }
};

export const getProducts = async (ctx: Koa.Context) => {
  const { page: _page , limit: _limit, ...query } = ctx.request.query;
  const { natsClient } = ctx.state;

  const page = parseInt(_page) || 0;
  const limit = parseInt(_limit) || 3;

  logger.info(JSON.stringify(ctx.request.query))

  if (query) {
    natsClient.publish("product.activity", {
      type: "SEARCH",
      host: ctx.headers.host,
      userAgent: ctx.headers["user-agent"],
      ip: ctx.ips.length > 0 ? ctx.ips[ctx.ips.length - 1] : ctx.ip,
      data: ctx.request.query,
    });
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
  logger.info("createProduct", JSON.stringify(data))
  await ProductModel.create(data)
  ctx.status = 200;
};

export const updateProduct = async (ctx: Koa.Context) => {
  const productId = ctx.request.URL.searchParams.get("id");
  const data = ctx.request.body;
  await ProductModel.findByIdAndUpdate(productId, data).exec();
  ctx.status = 200;
};

export const deleteProduct = async (ctx: Koa.Context) => {
  const productId = ctx.request.URL.searchParams.get("id");
  if (productId) {
    await ProductModel.deleteOne({ _id: productId }).exec();
    ctx.status = 200;
  }
};
