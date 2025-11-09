import type { Artist, Item, TopTracksOfUserResponse } from "@shortify/types/top/tracks";
import { Hono } from "hono";
import axiosinstance from "../../../utils/axios";
import factory from "../../../utils/factory";
import { accessToken, ensureValidToken } from "../../../utils/token";

export const topTracksOfuser = factory.createHandlers(async (c) => {
  try {
    // Ensure we have a valid token
    const isValid = await ensureValidToken();
    if (!isValid || !accessToken) {
      return c.json({
        error: "No valid access token available"
      }, 401);
    }

    const response = await axiosinstance.get<TopTracksOfUserResponse>(
      "/me/top/tracks?limit=10&time_range=medium_term",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const tracks = response.data.items.map((track: Item) => ({
      id: track.id,
      name: track.name,
      uri: track.uri,
      artists: track.artists.map((artist: Artist) => artist.name).join(", "),
      album: track.album.name,
      popularity: track.popularity,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
    }));

    return c.json(
      {
        tracks,
        total: response.data.total,
      },
      200,
    );
  } catch (error: any) {
    console.log("Error fetching top tracks:", error);
    
    // Handle specific Spotify API errors
    if (error.response?.status === 401) {
      return c.json({
        error: "Invalid or expired access token. Please re-authorize.",
        authUrl: "/api/auth/login"
      }, 401);
    }
    
    if (error.response?.status === 403) {
      return c.json({
        error: "Insufficient permissions. Make sure the app is authorized with user-top-read scope."
      }, 403);
    }

    return c.json(
      {
        error: "Failed to fetch top tracks",
        details: error.response?.data || error.message
      },
      500,
    );
  }
});

export const topTracksOfuserRoute = new Hono().get("/", ...topTracksOfuser);
