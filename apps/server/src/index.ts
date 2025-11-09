import "dotenv/config";
import * as cron from "node-cron";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { appRouter } from "./routers";
import { refreshAccessToken } from "../utils/token";

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

refreshAccessToken().catch(console.error);

cron.schedule("0 */1 * * *", () => {
  console.log("Refreshing access token...");
  refreshAccessToken().catch(console.error);
});
