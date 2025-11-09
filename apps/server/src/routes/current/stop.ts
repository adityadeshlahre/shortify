import { Hono, type Context } from "hono";
import axiosinstance from "../../../utils/axios";
import factory from "../../../utils/factory";
import { accessToken, ensureValidToken } from "../../../utils/token";

const stopCurrentSong = factory.createHandlers(async (c: Context) => {
  try {
    // Ensure we have a valid token
    const isValid = await ensureValidToken();
    if (!isValid || !accessToken) {
      return c.json({
        error: "No valid access token available"
      }, 401);
    }

    await axiosinstance.put("/me/player/pause", {}, {
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
  } catch (error: any) {
    console.log("Error stopping current song:", error);
    
    // Handle specific Spotify API errors
    if (error.response?.status === 401) {
      return c.json({
        error: "Invalid or expired access token. Please re-authorize.",
        authUrl: "/api/auth/login"
      }, 401);
    }
    
    if (error.response?.status === 403) {
      return c.json({
        error: "Player command failed. Make sure Spotify is active on a device."
      }, 403);
    }
    
    if (error.response?.status === 404) {
      return c.json({
        error: "No active device found. Please start Spotify on a device."
      }, 404);
    }

    return c.json(
      {
        error: "Failed to stop the current song",
        details: error.response?.data || error.message
      },
      500,
    );
  }
});

export const stopCurrentSongRoute = new Hono().post("/", ...stopCurrentSong);