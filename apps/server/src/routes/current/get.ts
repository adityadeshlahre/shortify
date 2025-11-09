import type { CurrentlyPlayingResponse } from "@shortify/types/current/current";
import { Hono, type Context } from "hono";
import axiosinstance from "../../../utils/axios";
import factory from "../../../utils/factory";
import { accessToken, ensureValidToken } from "../../../utils/token";

const showCurrentSong = factory.createHandlers(async (c: Context) => {
  try {
    const isValid = await ensureValidToken();
    if (!isValid || !accessToken) {
      return c.json({
        error: "No valid access token available"
      }, 401);
    }

    const currentSongResponse =
      await axiosinstance.get<CurrentlyPlayingResponse>(
        "/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

    if (!currentSongResponse.data) {
      return c.json(
        {
          song: null,
          message: "No song is currently playing"
        },
        200,
      );
    }

    return c.json(
      {
        song: currentSongResponse.data,
      },
      200,
    );
  } catch (error: any) {
    console.log("Error fetching current song:", error);

    if (error.response?.status === 401) {
      return c.json({
        error: "Invalid or expired access token. Please re-authorize.",
        authUrl: "/api/auth/login"
      }, 401);
    }
    
    if (error.response?.status === 204) {
      return c.json({
        song: null,
        message: "No song is currently playing"
      }, 200);
    }

    return c.json(
      {
        error: "Failed to fetch the current song",
        details: error.response?.data || error.message
      },
      500,
    );
  }
});

export const showCurrentSongRoute = new Hono().get("/", ...showCurrentSong);