import { Hono, type Context } from "hono";
import factory from "../../../utils/factory";
import { exchangeCodeForToken } from "../../../utils/token";

const callbackHandler = factory.createHandlers(async (c: Context) => {
  try {
    const code = c.req.query("code");
    const error = c.req.query("error");

    if (error) {
      return c.json({
        error: `Authorization failed: ${error}`
      }, 400);
    }

    if (!code) {
      return c.json({
        error: "No authorization code received"
      }, 400);
    }

    const tokenData = await exchangeCodeForToken(code);
    
    return c.json({
      message: "Authorization successful! You can now use the API endpoints.",
      tokenData: {
        access_token: tokenData.access_token.substring(0, 20) + "...", // Only show partial token for security
        expires_in: tokenData.expires_in,
        scope: tokenData.scope
      }
    }, 200);
  } catch (error) {
    console.log("Error in callback:", error);
    return c.json({
      error: "Failed to exchange authorization code for token"
    }, 500);
  }
});

export const callbackRoute = new Hono().get("/", ...callbackHandler);
