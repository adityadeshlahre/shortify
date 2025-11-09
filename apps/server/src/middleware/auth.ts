import { createMiddleware } from "hono/factory";
import { ensureValidToken, accessToken } from "../../utils/token";

export const requireValidToken = createMiddleware(async (c, next) => {
  try {
    const isValid = await ensureValidToken();
    
    if (!isValid || !accessToken) {
      return c.json({
        error: "No valid access token. Please authorize the application first.",
        authUrl: "/api/auth/login"
      }, 401);
    }
    
    await next();
  } catch (error) {
    console.error("Token validation error:", error);
    return c.json({
      error: "Token validation failed"
    }, 500);
  }
});
