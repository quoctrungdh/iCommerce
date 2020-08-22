import Koa from 'koa';
import HttpStatus from 'http-status-codes';
import ActivityModel from '../models/activity.model';

export const ping = async (ctx: Koa.Context) => {
  ctx.status = HttpStatus.OK;
};

export const getActivity = async (ctx: Koa.Context) => {
  const activityId = ctx.params.id;
  const activity = await ActivityModel.findOne({ _id: activityId });
  if (!activity) {
    ctx.throw(HttpStatus.NOT_FOUND);
  } else {
    ctx.body = activity;
    ctx.status = 200;
  }
};

export const getActivities = async (ctx: Koa.Context) => {
  const { page: _page, limit: _limit, ...query } = ctx.request.query;
  const page = parseInt(_page) || 0;
  const limit = parseInt(_limit) || 3;
  const activities = await ActivityModel.find(query)
    .sort({ createdAt: -1 })
    .skip(page * limit)
    .limit(limit);

  const count = await ActivityModel.countDocuments({}).exec();
  ctx.body = {
    data: activities,
    meta: {
      total: count,
      page: page,
      pageSize: activities.length,
    },
  };
};

export const createActivity = async (ctx: Koa.Context) => {
  const data = ctx.request.body;
  await ActivityModel.create(data);
  ctx.status = 200;
};

export const updateActivity = async (ctx: Koa.Context) => {
  const activityId = ctx.params.id;
  const data = ctx.request.body;
  await ActivityModel.findOne({ _id: activityId }, data).exec();
  ctx.status = 200;
};

export const deleteActivity = async (ctx: Koa.Context) => {
  const activityId = ctx.params.id;
  if (activityId) {
    await ActivityModel.deleteOne({ _id: activityId }).exec();
    ctx.status = 200;
  }
};
