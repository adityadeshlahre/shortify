import { validAccessToken } from "@/middleware";
import type { CurrentlyPlayingResponse } from "@shortify/types/current/current";
import { Hono, type Context } from "hono";
import axiosinstance from "utils/axios";
import factory from "utils/factory";

const showCurrentSong = factory.createHandlers(async (c: Context) => {
  try {
    const currentSongResponse =
      await axiosinstance.get<CurrentlyPlayingResponse>(
        "/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${c.get("accessToken")}`,
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
    return c.json(
      {
        error: "Failed to fetch the current song",
      },
      500,
    );
  }
});

export const showCurrentSongRoute = new Hono().get("/", validAccessToken, ...showCurrentSong);