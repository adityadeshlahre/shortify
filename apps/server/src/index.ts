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
      origin: process.env.CORS_ORIGIN || "*",
      allowMethods: ["GET", "POST", "PATCH", "OPTIONS", "PUT", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Length"],
    }),
  )
  .get("/", (c) => {
    return c.json({
      message: "Shortify API is running!",
      endpoints: {
        login: "/api/auth/login - Get authorization URL",
        callback: "/api/auth/callback - OAuth callback (handled by Spotify)",
        status: "/api/auth/status - Check authentication status",
        artists: "/api/artist - Get followed artists",
        current: "/api/current - Get currently playing song", 
        stop: "/api/current/stop - Stop current song",
        play: "/api/current/play - Resume/Play current song",
        topTracks: "/api/top/tracks - Get user's top tracks",
        devices: "/api/devices - Get available Spotify devices"
      },
      note: "Most endpoints require user authorization. Start with /api/auth/login"
    });
  })
  .route("/api", appRouter);

export default app;

cron.schedule("*/30 * * * *", () => {
  console.log("Attempting to refresh access token...");
  refreshAccessToken().catch(console.error);
});

console.log("🎵 Shortify server started!");
