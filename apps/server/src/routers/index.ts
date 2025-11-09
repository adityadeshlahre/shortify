import { showArtistsListRoute } from "../routes/artist/list";
import { showCurrentSongRoute } from "../routes/current/get";
import { stopCurrentSongRoute } from "../routes/current/stop";
import { resumeCurrentSongRoute } from "../routes/current/play";
import { topTracksOfuserRoute } from "../routes/top/tracks";
import { loginRoute } from "../routes/auth/login";
import { callbackRoute } from "../routes/auth/callback";
import { statusRoute } from "../routes/auth/status";
import { getDevicesRoute } from "../routes/devices/list";
import { requireValidToken } from "../middleware/auth";
import { Hono } from "hono";

const api = new Hono()
	.route("/auth/login", loginRoute)
	.route("/auth/callback", callbackRoute)
	.route("/auth/status", statusRoute)
	.use("/artist/*", requireValidToken)
	.use("/current/*", requireValidToken)
	.use("/top/*", requireValidToken)
	.use("/devices/*", requireValidToken)
	.route("/artist", showArtistsListRoute)
	.route("/current/stop", stopCurrentSongRoute)
	.route("/current/play", resumeCurrentSongRoute)
	.route("/top/tracks", topTracksOfuserRoute)
	.route("/current", showCurrentSongRoute)
	.route("/devices", getDevicesRoute);

export const appRouter = api;

export type AppRouter = typeof appRouter;
