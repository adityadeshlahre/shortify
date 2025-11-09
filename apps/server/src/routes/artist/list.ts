import type { ArtistsResponse } from "@shortify/types/artist/list";
import { Hono, type Context } from "hono";
import axiosinstance from "../../../utils/axios";
import factory from "../../../utils/factory";
import { accessToken, ensureValidToken } from "../../../utils/token";

const showArtistsList = factory.createHandlers(async (c: Context) => {
  try {
    // Ensure we have a valid token
    const isValid = await ensureValidToken();
    if (!isValid || !accessToken) {
      return c.json({
        error: "No valid access token available"
      }, 401);
    }

    const artistsIFollowResponse = await axiosinstance.get<ArtistsResponse>(
      "/me/following?type=artist&limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return c.json(
      {
        artists: artistsIFollowResponse.data.artists.items,
        total: artistsIFollowResponse.data.artists.total,
        next: artistsIFollowResponse.data.artists.next,
      },
      200,
    );
  } catch (error: any) {
    console.log("Error fetching followed artists:", error);
    
    // Handle specific Spotify API errors
    if (error.response?.status === 401) {
      return c.json({
        error: "Invalid or expired access token. Please re-authorize.",
        authUrl: "/api/auth/login"
      }, 401);
    }
    
    if (error.response?.status === 403) {
      return c.json({
        error: "Insufficient permissions. Make sure the app is authorized with user-follow-read scope."
      }, 403);
    }

    return c.json(
      {
        error: "Failed to fetch followed artists",
        details: error.response?.data || error.message
      },
      500,
    );
  }
});

export const showArtistsListRoute = new Hono().get("/", ...showArtistsList);