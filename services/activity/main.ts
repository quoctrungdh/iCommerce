import Koa from "koa";
import Router from "koa-router";
import koaLogger from "koa-logger";
import json from "koa-json";
import bodyParser from 'koa-bodyparser';
import { PORT, IS_DEV } from './constants'
import { initDatabase } from "./helpers/db";
import errorHandler from "./middlewares/errorHandler";
import { getActivities, getActivity, createActivity, updateActivity, deleteActivity, ping } from "./controllers/activity.controller";
import natsMiddleware from './middlewares/nats'
import logger from './helpers/logger'

const app = new Koa();
const router = new Router();

router.get("/ping", ping);
router.get("/", getActivities);
router.get("/:id", getActivity);
router.post("/", createActivity);
router.put("/", updateActivity);
router.delete("/", deleteActivity);

// Middlewares
app.use(errorHandler);
app.use(json());
app.use(bodyParser());
app.use(natsMiddleware)
if(IS_DEV) {
  app.use(koaLogger());
}

// Routes
app.use(router.routes()).use(router.allowedMethods());

/* centralized error handling: */
app.on('error', (err, ctx) => {
  logger.error(err)
});

app.listen(PORT, () => {
  initDatabase()
  console.log("Koa started", PORT);
});