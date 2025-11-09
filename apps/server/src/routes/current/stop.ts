import { Hono, type Context } from "hono";
import axiosinstance from "utils/axios";
import factory from "utils/factory";
import { accessToken } from "utils/token";

const stopCurrentSong = factory.createHandlers(async (c: Context) => {
  try {
    await axiosinstance.put("/me/player/pause", null, {
      // {}
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return c.json(
      {
        message: "Song stopped successfully",
      },
      200,
    );
  } catch (error) {
    console.log("Error stopping current song:", error);
    return c.json(
      {
        error: "Failed to stop the current song",
      },
      500,
    );
  }
});

export const stopCurrentSongRoute = new Hono().post("/", ...stopCurrentSong);