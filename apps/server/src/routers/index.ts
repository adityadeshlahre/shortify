import { showArtistsListRoute } from "@/routes/artist/list";
import { showCurrentSongRoute } from "@/routes/current/get";
import { stopCurrentSongRoute } from "@/routes/current/stop";
import { topTracksOfuserRoute } from "@/routes/top/tracks";
import { Hono } from "hono";

const api = new Hono()
	.route("/artist", showArtistsListRoute)
	.route("/current/stop", stopCurrentSongRoute)
	.route("/top/tracks", topTracksOfuserRoute)
	.route("/current", showCurrentSongRoute);

export const appRouter = api;

export type AppRouter = typeof appRouter;
