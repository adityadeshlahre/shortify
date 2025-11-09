import axios from "axios";

export let accessToken = "";
export let refreshToken = "";
export let expiresIn = 0;

const redirectUri = process.env.REDIRECT_URI || "";
const clientId = process.env.CLIENT_ID || "";
const clientSecret = process.env.CLIENT_SECRET || "";

export function getAuthUrl() {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-follow-read",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-modify-playback-state",
    "user-top-read"
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    show_dialog: "true"
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
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
      refresh_token: string;
      scope: string;
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
    refreshToken = response.data.refresh_token;
    expiresIn = Date.now() + response.data.expires_in * 1000;

    console.log("User access token obtained");
    return response.data;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
}

// Refresh user access token using refresh token
export async function refreshAccessToken() {
  if (!refreshToken) {
    console.warn("No refresh token available. User needs to re-authorize.");
    return false;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
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
      refresh_token?: string;
      scope: string;
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
    expiresIn = Date.now() + response.data.expires_in * 1000;

    console.log("Access token refreshed successfully");
    return true;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return false;
  }
}

// Check if token is valid and refresh if needed
export async function ensureValidToken() {
  if (Date.now() >= expiresIn - 60000) { // Refresh 1 minute before expiry
    return await refreshAccessToken();
  }
  return !!accessToken;
}
