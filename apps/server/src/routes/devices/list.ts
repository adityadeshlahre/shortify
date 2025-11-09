import type { DevicesResponse, Device } from "@shortify/types/devices/devices";
import { Hono, type Context } from "hono";
import axiosinstance from "../../../utils/axios";
import factory from "../../../utils/factory";
import { accessToken, ensureValidToken } from "../../../utils/token";

const getDevices = factory.createHandlers(async (c: Context) => {
  try {
    const isValid = await ensureValidToken();
    if (!isValid || !accessToken) {
      return c.json({
        error: "No valid access token available"
      }, 401);
    }

    const devicesResponse = await axiosinstance.get<DevicesResponse>("/me/player/devices", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const devices = devicesResponse.data.devices || [];
    const activeDevice = devices.find((device: Device) => device.is_active);

    return c.json(
      {
        devices,
        activeDevice,
        hasActiveDevice: !!activeDevice,
        message: devices.length === 0 
          ? "No devices found. Please open Spotify on a device."
          : !activeDevice 
            ? "No active device. Please start playing music on one of your devices."
            : "Devices found successfully"
      },
      200,
    );
  } catch (error: any) {
    console.log("Error fetching devices:", error);

    if (error.response?.status === 401) {
      return c.json({
        error: "Invalid or expired access token. Please re-authorize.",
        authUrl: "/api/auth/login"
      }, 401);
    }

    return c.json(
      {
        error: "Failed to fetch devices",
        details: error.response?.data || error.message
      },
      500,
    );
  }
});

export const getDevicesRoute = new Hono().get("/", ...getDevices);
