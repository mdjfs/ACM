import { Client, Intents, Interaction } from "discord.js";
import { token, clientId } from "../app.json";
import { registerCommands, commands } from "./commands";
import server from "./backend";

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
  ],
});

bot.once("ready", async () => {
  console.log("Logged successfully");
  await registerCommands(token, clientId);
});

bot.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  const command = commands.get(interaction.commandName);
  if (command) {
    command.process(interaction);
  } else {
    // ....
  }
});

bot.once("error", (e) => {
  console.error("Login error:", e);
});

bot.login(token);

server.listen("3000");
console.log("Server listening in port 3000");
