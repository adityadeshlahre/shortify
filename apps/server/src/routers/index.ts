import { showArtistsList } from "@/routes/artist/list";
import { showCurrentSong } from "@/routes/current/get";
import { stopCurrentSong } from "@/routes/current/stop";
import { topTracksOfuser } from "@/routes/top/tracks";
import { Hono } from "hono";

const api = new Hono()
	.route("/artist", showArtistsList)
	.route("/current/stop", stopCurrentSong)
	.route("/top/tracks", topTracksOfuser) //top10songs
	.route("/current", showCurrentSong);

export const appRouter = api;

export type AppRouter = typeof appRouter;
