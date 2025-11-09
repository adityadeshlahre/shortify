import type { ArtistsResponse } from "@shortify/types/artist/list";
import type { Context } from "hono";
import axiosinstance from "utils/axios";
import factory from "utils/factory";
import { accessToken } from "utils/token";

export const showArtistsList = factory.createHandlers(async (c: Context) => {
	try {
		const artistsIFollowResponse = await axiosinstance.get<ArtistsResponse>(
			"/me/following?type=artist",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		return c.json(
			{
				artists: artistsIFollowResponse.data.artists.items,
			},
			200,
		);
	} catch (error) {
		return c.json(
			{
				error: "Failed to fetch followed artists",
			},
			500,
		);
	}
});
