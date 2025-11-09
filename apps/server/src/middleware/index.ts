import type { Context } from "hono";
import axiosinstance from "utils/axios";
import factory from "utils/factory";

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
		return c.json({ error: "Invalid or expired token" }, 401);
	}
});
