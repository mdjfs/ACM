import Express from "express";
import Path from "path";
import {
  discordAuth,
  discordData,
  discordRefresh,
  formatSession,
} from "./modules/auth";
import Session from "express-session";
import config from "../../app.json";

const app = Express();
app.use(Session({ secret: config.clientSecret }));

app.get("/discord-auth/identify", (_, res) => {
  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.append("client_id", config.clientId);
  url.searchParams.append("redirect_uri", config.discordAuth.redirectUrl);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", config.discordAuth.scope);
  res.redirect(url.toString());
});

app.get("/discord-auth", async (req, res) => {
  let session = req.session["user_session"];
  if (session) {
    try {
      session = formatSession(JSON.parse(session));
      if (session.isExpired()) {
        session = await discordRefresh(session);
        req.session["user_session"] = JSON.stringify(session);
      }
      const data = await discordData(session);
      res.send(data);
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

app.get("/discord-auth/redirect", async (req, res) => {
  const code = req.query["code"];
  if (code) {
    try {
      const session = await discordAuth(code as string);
      req.session["user_session"] = JSON.stringify(session);
      res.redirect("/");
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
});

app.get("/js", (_, res) => {
  res.sendFile(Path.join(__dirname, "../build/build.js"));
});

app.get("*", (_, res) => {
  res.sendFile(Path.join(__dirname, "../build/index.html"));
});

export default app;
