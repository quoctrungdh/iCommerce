import Koa from "koa";
import Router from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import { PORT } from './constants'
import { initDatabase } from "./helpers/db";
import { getProduct, getProducts, createProduct, updateProduct, deleteProduct } from "./controllers/product.controller";
import errorHandler from "./middlewares/errorHandler";

const app = new Koa();
const router = new Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/", updateProduct);
router.delete("/", deleteProduct);

// Middlewares
app.use(errorHandler);
app.use(json());
app.use(logger());

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