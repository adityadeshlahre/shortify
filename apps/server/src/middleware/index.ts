import type { Context } from "hono";
import axiosinstance from "utils/axios";
import factory from "utils/factory";
import { refreshAccessToken } from "utils/token";

export const validAccessToken = factory.createMiddleware(async (c: Context, next) => {
	try {
		const authHeader = c.req.header("Authorization");
		if (!authHeader) return c.json({ error: "Missing token" }, 401);

		const token = authHeader.replace("Bearer ", "");

		await axiosinstance.get("/me", {
			headers: { Authorization: `Bearer ${token}` },
		});

		await next();
	} catch (err) {
		if (
			err && typeof err === 'object' && 'response' in err &&
			err.response && typeof err.response === 'object' && 'status' in err.response &&
			err.response.status === 401
		) {
			console.log("Invalid token");
			await refreshAccessToken();
			next();
		} else {
			return c.json({ error: `Internal server error ${err}` }, 500);
		}
	}
});
