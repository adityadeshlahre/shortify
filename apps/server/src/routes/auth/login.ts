import { Hono, type Context } from "hono";
import factory from "../../../utils/factory";
import { getAuthUrl } from "../../../utils/token";

const loginHandler = factory.createHandlers(async (c: Context) => {
  try {
    const authUrl = getAuthUrl();
    return c.json({
      authUrl,
      message: "Visit this URL to authorize the application"
    }, 200);
  } catch (error) {
    console.log("Error generating auth URL:", error);
    return c.json({
      error: "Failed to generate authorization URL"
    }, 500);
  }
});

export const loginRoute = new Hono().get("/", ...loginHandler);
