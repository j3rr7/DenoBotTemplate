import { Events } from 'discord.js';
import type { BotClientType } from '../types.ts';
import logger from '../utils/logger.ts'; 

const readyEvent = {
  name: Events.ClientReady,
  once: true,
  async execute(client: BotClientType) {
    if (!client.user) {
      logger.error("Client user is null in ready event.");
      return;
    }
    logger.info(`Event: ${Events.ClientReady} - Shard ${client.shard?.ids[0] ?? 0} is ready! Logged in as ${client.user.tag}`);
  },
};

export default readyEvent;