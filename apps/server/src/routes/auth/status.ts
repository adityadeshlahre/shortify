import { Hono, type Context } from "hono";
import factory from "../../../utils/factory";
import { accessToken, expiresIn } from "../../../utils/token";

const statusHandler = factory.createHandlers(async (c: Context) => {
  const hasToken = !!accessToken;
  const tokenExpired = Date.now() >= expiresIn;
  
  return c.json({
    hasToken,
    tokenExpired,
    tokenExpiresAt: expiresIn > 0 ? new Date(expiresIn).toISOString() : null,
    needsAuth: !hasToken || tokenExpired,
    authUrl: !hasToken || tokenExpired ? "/api/auth/login" : null
  }, 200);
});

export const statusRoute = new Hono().get("/", ...statusHandler);
