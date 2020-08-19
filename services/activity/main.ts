import Koa from "koa";
import Router from "koa-router";
import koaLogger from "koa-logger";
import json from "koa-json";
import { PORT, IS_DEV } from './constants'
import { initDatabase } from "./helpers/db";
import errorHandler from "./middlewares/errorHandler";
import { getActivities, getActivity, createActivity, updateActivity, deleteActivity, ping } from "./controllers/activity.controller";
import natsMiddleware from './middlewares/nats'

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
if(IS_DEV) {
  app.use(koaLogger());
}
app.use(natsMiddleware)

// Routes
app.use(router.routes()).use(router.allowedMethods());

/* centralized error handling: */
app.on('error', (err, ctx) => {
  console.log("onerror", err)
  /* 
   *   console.log error
   *   write error to log file
   *   save error and request information to database if ctx.request match condition
   *   ...
  */
});

app.listen(PORT, () => {
  initDatabase()
  console.log("Koa started", PORT);
});