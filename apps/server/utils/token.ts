import axios from "axios";

export let accessToken = "";
export let refreshToken = "";
export let expiresIn = 0;

const redirectUri = process.env.REDIRECT_URI || "";
const clientId = process.env.CLIENT_ID || "";
const clientSecret = process.env.CLIENT_SECRET || "";

export async function refreshAccessToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  try {
    const response = await axios.post<{
      access_token: string;
      token_type: 'Bearer';
      expires_in: number;
      refresh_token?: string;
      scope?: string;
    }>(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          Authorization: `Basic ${authBuffer}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    accessToken = response.data.access_token;
    if (response.data.refresh_token) {
      refreshToken = response.data.refresh_token;
    }
    expiresIn = response.data.expires_in;

    console.log("Access token refreshed");
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
}
