import Koa from 'koa'
import HttpStatus from 'http-status-codes'
import ActivityModel from '../models/activity.model'

export const getActivity = async (ctx: Koa.Context) => {
  const activityId = ctx.request.URL.searchParams.get("id");
  const activity = await ActivityModel.findOne({ _id: activityId })
  .exec()

  if (!activity) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    ctx.body = activity
    ctx.status = 200
  }
}

export const getActivities = async (ctx: Koa.Context) => {
  const { page = 1, limit = 10, name } = ctx.request.query;
  const activities = await ActivityModel.find({ name })
  .sort({ createdAt: -1 })
  .skip(page * limit)
  .limit(limit)
  .exec()

  if (!activities.length) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    const count = await ActivityModel.countDocuments({}).exec()
    ctx.body = {
      data: activities,
      meta: {
        total: count,
        page: page,
        pageSize: activities.length,
      }
    }
  }
}

export const createActivity = async (ctx: Koa.Context) => {
  const data = ctx.body;
  await ActivityModel.create(data);
  ctx.status = 200
}

export const updateActivity = async (ctx: Koa.Context) => {
  const activityId = ctx.request.URL.searchParams.get("id");
  const data = ctx.body;
  await ActivityModel.findByIdAndUpdate(activityId, data).exec();
  ctx.status = 200
}

export const deleteActivity = async (ctx: Koa.Context) => {
  const activityId = ctx.request.URL.searchParams.get("id");
  if(activityId) {
    await ActivityModel.deleteOne({ _id: activityId }).exec();
    ctx.status = 200
  }
}
