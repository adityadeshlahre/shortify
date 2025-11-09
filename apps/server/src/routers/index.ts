import { showArtistsListRoute } from "../routes/artist/list";
import { showCurrentSongRoute } from "../routes/current/get";
import { stopCurrentSongRoute } from "../routes/current/stop";
import { topTracksOfuserRoute } from "../routes/top/tracks";
import { loginRoute } from "../routes/auth/login";
import { callbackRoute } from "../routes/auth/callback";
import { statusRoute } from "../routes/auth/status";
import { requireValidToken } from "../middleware/auth";
import { Hono } from "hono";

const api = new Hono()
	// Auth routes (no middleware needed)
	.route("/auth/login", loginRoute)
	.route("/auth/callback", callbackRoute)
	.route("/auth/status", statusRoute)
	// Protected routes (require valid token)
	.use("/artist/*", requireValidToken)
	.use("/current/*", requireValidToken)
	.use("/top/*", requireValidToken)
	.route("/artist", showArtistsListRoute)
	.route("/current/stop", stopCurrentSongRoute)
	.route("/top/tracks", topTracksOfuserRoute)
	.route("/current", showCurrentSongRoute);

export const appRouter = api;

export type AppRouter = typeof appRouter;
