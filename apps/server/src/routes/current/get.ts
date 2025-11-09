import type { CurrentlyPlayingResponse } from "@shortify/types/current/current";
import { Hono, type Context } from "hono";
import axiosinstance from "utils/axios";
import factory from "utils/factory";
import { accessToken } from "utils/token";

const showCurrentSong = factory.createHandlers(async (c: Context) => {
  try {
    const currentSongResponse =
      await axiosinstance.get<CurrentlyPlayingResponse>(
        "/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

    return c.json(
      {
        song: currentSongResponse.data,
      },
      200,
    );
  } catch (error) {
    console.log("Error fetching current song:", error);
    return c.json(
      {
        error: "Failed to fetch the current song",
      },
      500,
    );
  }
});

export const showCurrentSongRoute = new Hono().get("/", ...showCurrentSong);