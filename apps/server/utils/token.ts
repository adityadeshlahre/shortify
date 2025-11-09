import axios from "axios";

export let accessToken = "";
export let refreshToken = "";

const redirectUri = process.env.REDIRECT_URI || "";
const clientId = process.env.CLIENT_ID || "";
const clientSecret = process.env.CLIENT_SECRET || "";

async function refreshAccessToken() {
	const params = new URLSearchParams();
	params.append("grant_type", "refresh_token");
	params.append("refresh_token", refreshToken);

	const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString(
		"base64",
	);

	try {
		const response = await axios.post(
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

		console.log("Access token refreshed");
	} catch (error) {
		console.error("Error refreshing access token:", error);
	}
}
