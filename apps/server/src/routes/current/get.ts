import type { CurrentlyPlayingResponse } from "@shortify/types/current/current";
import type { Context } from "hono";
import axiosinstance from "utils/axios";
import factory from "utils/factory";

export const showCurrentSong = factory.createHandlers(
	async (c: Context) => {
		try {
			const currentSongResponse = await axiosinstance.get<CurrentlyPlayingResponse>("/me/player/currently-playing", {
				headers: {
					Authorization: `Bearer ${c.get("accessToken")}`,
				},
			});

			return c.json(
				{
					song: currentSongResponse.data,
				},
				200,
			);
		} catch (error) {
			return c.json(
				{
					error: "Failed to fetch the current song",
				},
				500,
			);
		}
	}
);
