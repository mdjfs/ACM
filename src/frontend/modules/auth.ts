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

export function getData(): DiscordData {
  const session = sessionStorage.getItem("session");
  if (session) {
    return JSON.parse(session);
  }
  return null;
}
