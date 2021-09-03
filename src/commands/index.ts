import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Collection } from "discord.js";
import { Command } from "./command";
import { Track } from "./track";

export type CommandCollection = Collection<string, Command>;

const availableCommands = [Track];

function initCommands(): CommandCollection {
  const collection: CommandCollection = new Collection();
  for (const Command of availableCommands) {
    const instance = new Command();
    collection.set(instance.name, instance);
  }
  return collection;
}

export const commands: CommandCollection = initCommands();

export async function registerCommands(token: string, clientId: string) {
  const rest = new REST().setToken(token);
  const body = commands.map((cmd) => cmd.toJSON());
  const route = Routes.applicationGuildCommands(clientId, "814333562509590619");
  try {
    await rest.put(route as string as `/${string}`, { body });
    console.log("Successfully registered bot commands");
  } catch (e) {
    console.error("Error in command register:", e);
  }
}
