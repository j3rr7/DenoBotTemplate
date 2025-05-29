import { ChatInputCommandInteraction } from 'discord.js';
import type { Command, BotClientType } from '../types.ts';

export default {
  name: 'ping',
  description: 'Replies with Pong!',
  async execute(_: BotClientType, interaction: ChatInputCommandInteraction) {
    await interaction.reply({ content: 'Pong!', ephemeral: true });
  },
} as Command;