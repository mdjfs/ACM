import { CommandInteraction } from "discord.js";
import { Command } from "./command";

export class Track extends Command {
  name = "si";
  description = "si";

  execute(interaction: CommandInteraction) {
    interaction.reply("Si mafer");
  }
}
