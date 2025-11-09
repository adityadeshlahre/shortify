import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { appRouter } from "./routers";

const app = new Hono();

app
  .use(logger())
  .use(
    "/*",
    cors({
      origin: process.env.CORS_ORIGIN || "",
      allowMethods: ["GET", "POST", "PATCH", "OPTIONS", "PUT", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Length"],
    }),
  )
  .get("/", (c) => {
    return c.text("OK");
  })
  .route("/api", appRouter);

export default app;
