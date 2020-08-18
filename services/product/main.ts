import Koa from "koa";
import Router from "koa-router";
import koaLogger from "koa-logger";
import json from "koa-json";
import { PORT, IS_DEV } from './constants'
import { initDatabase } from "./helpers/db";
import { getProduct, getProducts, createProduct, updateProduct, deleteProduct, ping } from "./controllers/product.controller";
import errorHandler from "./middlewares/errorHandler";
import natsMiddleware from './middlewares/nats'
import logger from './helpers/logger'

const app = new Koa();
const router = new Router();
router.get("/ping", ping);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/", updateProduct);
router.delete("/", deleteProduct);

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
  logger.error(err)
});

app.listen(PORT, () => {
  initDatabase()
  console.log("Koa started", PORT);
});