import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import type { Command, BotClientType } from "../types.ts";
import logger from "../utils/logger.ts";

export default {
  name: "sync-commands",
  description: "Syncs the bot commands with Discord API",
  async execute(
    client: BotClientType,
    interaction: ChatInputCommandInteraction,
  ) {
    if (!interaction.inGuild() || !interaction.guild) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    const member = interaction.guild.members.cache.get(interaction.user.id) ||
      await interaction.guild.members.fetch(interaction.user.id);
    if (
      !member ||
      !member.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      await interaction.reply({
        content: "You must be an administrator to use this command.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const commandsToDeploy = client.commands
        .filter((cmd) => cmd.name !== this.name)
        .map((cmd) => {
          if (!cmd.description) {
            logger.warn(
              `Command "${cmd.name}" is missing a description during sync.`,
            );
            return null;
          }
          return {
            name: cmd.name,
            description: cmd.description,
          };
        })
        .filter((cmd) => cmd !== null);

      const selfCommandData = {
        name: this.name,
        description: this.description,
      };
      const allCommandsToDeploy = [...commandsToDeploy, selfCommandData];

      if (allCommandsToDeploy.length === 0) {
        await interaction.editReply("No commands found to deploy.");
        return;
      }

      logger.info(
        `Admin ${interaction.user.tag} initiated command sync for guild ${interaction.guild.name} (${interaction.guildId}).`,
      );
      logger.info(
        `Attempting to deploy ${allCommandsToDeploy.length} commands: ${
          allCommandsToDeploy.map((c) => c.name).join(", ")
        }`,
      );

      await interaction.guild.commands.set(allCommandsToDeploy as any[]);

      logger.info(
        `Successfully deployed ${allCommandsToDeploy.length} commands to guild ${interaction.guild.name}.`,
      );
      await interaction.editReply(
        `Successfully synchronized ${allCommandsToDeploy.length} commands for this server.`,
      );
    } catch (error) {
      logger.error(
        `Failed to sync commands for guild ${interaction.guildId}:`,
        error,
      );
      await interaction.editReply(
        "An error occurred while synchronizing commands. Check logs.",
      );
    }
  },
} as Command;
