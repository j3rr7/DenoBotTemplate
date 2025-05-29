import { Events, Interaction } from 'discord.js';
import type { BotClientType } from '../types.ts';
import logger from '../utils/logger.ts'; 

const interactionCreateEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(client: BotClientType, interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      logger.warn(`No command matching "${interaction.commandName}" was found by event handler.`);
      try {
        await interaction.reply({ content: `Unknown command: ${interaction.commandName}`, ephemeral: true });
      } catch (replyError) {
        logger.error(`Failed to reply to unknown command interaction:`, replyError)
      }
      return;
    }

    try {
      await command.execute(client, interaction);
    } catch (error) {
      logger.error(`Error executing command ${interaction.commandName} from event handler:`, error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  },
};

export default interactionCreateEvent;