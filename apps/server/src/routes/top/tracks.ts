import { validAccessToken } from "@/middleware";
import type { TopTracksOfUserResponse } from "@shortify/types/top/tracks";
import { Hono } from "hono";
import axiosinstance from "utils/axios";
import factory from "utils/factory";
import { accessToken } from "utils/token";

export const topTracksOfuser = factory.createHandlers(async (c) => {
  try {
    const response = await axiosinstance.get<TopTracksOfUserResponse>(
      "/me/top/tracks?limit=10",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const tracks = response.data.items.map((track: any) => ({
      name: track.name,
      uri: track.uri,
      artists: track.artists.map((artist: any) => artist.name).join(", "),
    }));

    return c.json(
      {
        tracks,
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        error: "Failed to fetch top tracks",
      },
      500,
    );
  }
});

export const topTracksOfuserRoute = new Hono().get("/", validAccessToken, ...topTracksOfuser);
