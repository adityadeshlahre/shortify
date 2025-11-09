import axios from "axios";

export let accessToken = "";
export let expiresIn = 0;

const redirectUri = process.env.REDIRECT_URI || "";
const clientId = process.env.CLIENT_ID || "";
const clientSecret = process.env.CLIENT_SECRET || "";

export async function refreshAccessToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);


  const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  try {
    const response = await axios.post<{
      access_token: string;
      token_type: 'Bearer';
      expires_in: number;
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
    console.log(accessToken);
    expiresIn = Date.now() + response.data.expires_in * 1000;

    console.log("Access token refreshed");
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
}
