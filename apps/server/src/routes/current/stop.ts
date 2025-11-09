import type { Context } from "hono";
import axiosinstance from "utils/axios";
import factory from "utils/factory";

export const stopCurrentSong = factory.createHandlers(
	async (c: Context) => {
		try {
			await axiosinstance.put("/me/player/pause", null, { // {}
				headers: {
					Authorization: `Bearer ${c.get("accessToken")}`,
				},
			});

			return c.json(
				{
					message: "Song stopped successfully",
				},
				200,
			);
		} catch (error) {
			return c.json(
				{
					error: "Failed to stop the current song",
				},
				500,
			);
		}
	}
);
