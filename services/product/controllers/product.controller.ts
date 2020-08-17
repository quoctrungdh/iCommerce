import Koa from 'koa'
import HttpStatus from 'http-status-codes'
import ProductModel from '../models/product.model'

export const getProduct = async (ctx: Koa.Context) => {
  const productId = ctx.request.URL.searchParams.get("id");
  const product = await ProductModel.findOne({ _id: productId })
  .exec()

  if (!product) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    ctx.body = product
    ctx.status = 200
  }
}

export const getProducts = async (ctx: Koa.Context) => {
  const { page = 1, limit = 10, name } = ctx.request.query;
  const products = await ProductModel.find({ name })
  .sort({ updatedAt: -1 })
  .skip(page * limit)
  .limit(limit)
  .exec()

  if (!products.length) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    const count = await ProductModel.countDocuments({}).exec()
    ctx.body = {
      data: products,
      meta: {
        total: count,
        page: page,
        pageSize: products.length,
      }
    }
  }
}

export const createProduct = async (ctx: Koa.Context) => {
  const data = ctx.body;
  await ProductModel.create(data);
  ctx.status = 200
}

export const updateProduct = async (ctx: Koa.Context) => {
  const productId = ctx.request.URL.searchParams.get("id");
  const data = ctx.body;
  await ProductModel.findByIdAndUpdate(productId, data).exec();
  ctx.status = 200
}

export const deleteProduct = async (ctx: Koa.Context) => {
  const productId = ctx.request.URL.searchParams.get("id");
  if(productId) {
    await ProductModel.deleteOne({ _id: productId }).exec();
    ctx.status = 200
  }
}
