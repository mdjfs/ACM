import app from "../../../app.json";
import axios from "axios";

import { User } from "../../database/models/User";
import { UniqueConstraintError } from "sequelize";

export interface Session {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  refresh_at: Date | string;
  isExpired: () => boolean;
}

export function formatSession(session: Session) {
  if (!session.refresh_at) session.refresh_at = new Date().toString();
  session.isExpired = () => {
    const { refresh_at, expires_in } = session;
    const refresh_at_date = new Date(refresh_at);
    return refresh_at_date.getTime() + expires_in - new Date().getTime() <= 0;
  };
  return session;
}

export async function discordAuth(code: string): Promise<Session> {
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("client_id", app.clientId);
  params.append("client_secret", app.clientSecret);
  params.append("redirect_uri", app.discordAuth.redirectUrl);
  params.append("grant_type", "authorization_code");
  const response = await axios.post(
    "https://discord.com/api/v9/oauth2/token",
    params
  );
  const session = formatSession(response.data);
  const data = await discordData(session);
  try {
    const { username, avatar, id } = data.user;
    await User.create({ discordId: id, username, avatar });
  } catch (err) {
    if (!(err instanceof UniqueConstraintError)) {
      console.error("Unexpected error creating user:", err);
      throw err;
    }
  }
  return session;
}

export async function discordRefresh(session: Session): Promise<Session> {
  const params = new URLSearchParams();
  params.append("client_id", app.clientId);
  params.append("client_secret", app.clientSecret);
  params.append("refresh_token", session.refresh_token);
  params.append("grant_type", "refresh_token");
  const response = await axios.post(
    "https://discord.com/api/v9/oauth2/token",
    params
  );
  response.data.refresh_at = new Date();
  return formatSession(response.data);
}

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator?: string;
  public_flags?: number;
}

export interface DiscordApp {
  id: string;
  name: string;
  icon: string;
  description: string;
  summary: string;
  hook: boolean;
  bot_public: boolean;
  bot_require_code_grant: boolean;
  verify_key: string;
}

export interface DiscordData {
  application: DiscordApp;
  scopes: string[];
  expires: string;
  user: DiscordUser;
}

export async function discordData(session: Session): Promise<DiscordData> {
  if (session.isExpired()) session = await discordRefresh(session);
  const response = await axios.get("https://discord.com/api/v9/oauth2/@me", {
    headers: {
      authorization: `${session.token_type} ${session.access_token}`,
    },
  });
  return response.data;
}
