import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { Collection, CommandInteraction } from "discord.js";

export class SubCommand extends SlashCommandSubcommandBuilder {
  execute(interaction: CommandInteraction) {}
}

export class Command extends SlashCommandBuilder {
  subcommands: Collection<string, SubCommand> = new Collection();
  execute(interaction: CommandInteraction) {}
  setSubcommands(subcommands: SubCommand[]) {
    for (const subcommand of subcommands) {
      this.subcommands.set(subcommand.name, subcommand);
    }
  }
  process(interaction: CommandInteraction) {
    try {
      const subcommand = this.subcommands.get(
        interaction.options.getSubcommand()
      );
      subcommand.execute(interaction);
    } catch {
      this.execute(interaction);
    }
  }
}
