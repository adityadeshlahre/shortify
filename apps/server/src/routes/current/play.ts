import { Hono, type Context } from "hono";
import axiosinstance from "../../../utils/axios";
import factory from "../../../utils/factory";
import { accessToken, ensureValidToken } from "../../../utils/token";

const resumeCurrentSong = factory.createHandlers(async (c: Context) => {
  try {
    const isValid = await ensureValidToken();
    if (!isValid || !accessToken) {
      return c.json({
        error: "No valid access token available"
      }, 401);
    }

    const devicesResponse = await axiosinstance.get("/me/player/devices", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const devices = devicesResponse.data.devices || [];
    const activeDevice = devices.find((device: any) => device.is_active);

    if (devices.length === 0) {
      return c.json({
        error: "No devices available. Please open Spotify on a device (phone, computer, web player, etc.)",
        suggestion: "Open Spotify app on any device and try again",
        devicesEndpoint: "/api/devices"
      }, 404);
    }

    if (!activeDevice) {
      return c.json({
        error: "No active device found. Please start Spotify on one of your devices first.",
        suggestion: "Open Spotify and play any song, then you can use this endpoint to resume",
        availableDevices: devices.map((d: any) => ({
          id: d.id,
          name: d.name,
          type: d.type,
          isActive: d.is_active
        })),
        devicesEndpoint: "/api/devices"
      }, 403);
    }

    // Now try to resume/play the playback
    await axiosinstance.put("/me/player/play", {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return c.json(
      {
        message: "Playback resumed successfully",
        device: {
          name: activeDevice.name,
          type: activeDevice.type
        }
      },
      200,
    );
  } catch (error: any) {
    console.log("Error resuming current song:", error);

    if (error.response?.status === 401) {
      return c.json({
        error: "Invalid or expired access token. Please re-authorize.",
        authUrl: "/api/auth/login"
      }, 401);
    }

    if (error.response?.status === 403) {
      return c.json({
        error: "Player command failed. This usually means:",
        reasons: [
          "No device is currently active",
          "The device doesn't support remote control",
          "Spotify Premium is required for playback control"
        ],
        suggestion: "Make sure you have an active Spotify device and Premium subscription",
        devicesEndpoint: "/api/devices"
      }, 403);
    }

    if (error.response?.status === 404) {
      return c.json({
        error: "No active device found. Please start Spotify on a device.",
        suggestion: "Open Spotify and play music, then try again",
        devicesEndpoint: "/api/devices"
      }, 404);
    }

    return c.json(
      {
        error: "Failed to resume playback",
        details: error.response?.data || error.message,
        suggestion: "Check if Spotify is active on a device and you have Premium subscription",
        devicesEndpoint: "/api/devices"
      },
      500,
    );
  }
});

export const resumeCurrentSongRoute = new Hono()
  .get("/", ...resumeCurrentSong)
  .post("/", ...resumeCurrentSong);
