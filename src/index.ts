import { ShardingManager } from 'discord.js';
import logger from "./utils/logger.ts";
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const token = Deno.env.get("DISCORD_TOKEN");

if (!token) {
  logger.error("Error: DISCORD_TOKEN not found in environment variables.");
  Deno.exit(1);
}

const shardScriptPath = join(__dirname, 'bot.ts');

const manager = new ShardingManager(shardScriptPath, {
  token: token,
  totalShards: 'auto',
});

manager.on('shardCreate', shard => {
  logger.info(`Shard ${shard.id} launched successfully.`);

  shard.on('message', message => {
    logger.debug(`Message from shard ${shard.id}:`, message);
  });
});

async function spawnShards() {
  try {
    await manager.spawn();
    logger.info(`Successfully spawned ${manager.totalShards} shards.`);
  } catch (error) {
    logger.error("Error spawning shards:", error);
  }
}

spawnShards();