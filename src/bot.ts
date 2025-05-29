import { Client, GatewayIntentBits, Collection, ClientOptions } from 'discord.js';
import { join } from "jsr:@std/path/join";
import { dirname } from "jsr:@std/path/dirname";
import { walk } from "jsr:@std/fs/walk";
import logger from "./utils/logger.ts";
import type { Command, Event } from './types.ts';

class BotClient extends Client {
  public commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}

const client = new BotClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

async function loadCommands() {
  const commandsPath = join(dirname(import.meta.url.substring(8)), 'commands');
  logger.info(`Looking for commands in: ${commandsPath}`);

  try {
    for await (const entry of walk(commandsPath, { maxDepth: 1, exts: [".ts"], skip: [/^_/] })) {
      if (entry.isFile) {
        logger.info(`Found potential command file: ${entry.path}`);
        try {
          const commandModule = await import(`file://${entry.path}`);
          const command: Command = commandModule.default || commandModule;

          if (command && typeof command.execute === 'function' && command.name) {
            client.commands.set(command.name, command);
            logger.info(`Loaded command: ${command.name} from ${entry.name}`);
          } else {
            logger.warn(`The command at ${entry.path} is missing a required "name" or "execute" property or is not correctly structured.`);
          }
        } catch (error) {
          logger.error(`Error importing command from ${entry.path}:`, error);
        }
      }
    }
  } catch (error) {
    logger.error(`Error reading commands directory ${commandsPath}:`, error);
    if (error instanceof Deno.errors.NotFound) {
      logger.warn(`Commands directory not found at ${commandsPath}. No commands will be loaded.`);
      await Deno.mkdir(commandsPath, { recursive: true });
      logger.info(`Created commands directory at ${commandsPath}. Please add command files there.`);
    }
  }
}

async function loadEvents() {
  const eventsPath = join(dirname(import.meta.url.substring(8)), 'events');
  logger.info(`Looking for events in: ${eventsPath}`);

  try {
    for await (const entry of walk(eventsPath, { maxDepth: 1, exts: [".ts"], skip: [/^_/] })) {
      if (entry.isFile) {
        try {
          const eventModuleImport = await import(`file://${entry.path}`);
          const event: Event = eventModuleImport.default || eventModuleImport;

          if (event && typeof event.execute === 'function' && event.name) {
            if (event.once) {
              client.once(event.name, (...args) => event.execute(client, ...args));
              logger.info(`Loaded ONCE event: ${event.name} from ${entry.name}`);
            } else {
              client.on(event.name, (...args) => event.execute(client, ...args));
              logger.info(`Loaded event: ${event.name} from ${entry.name}`);
            }
          } else {
            logger.warn(`The event at ${entry.path} is missing required "name" or "execute" property or is not structured correctly.`);
          }
        } catch (error) {
          logger.error(`Error importing event from ${entry.path}:`, error);
        }
      }
    }
  } catch (error) {
    logger.error(`Error reading events directory ${eventsPath}:`, error);
    if (error instanceof Deno.errors.NotFound) {
      logger.warn(`Events directory not found at ${eventsPath}.`);
    }
  }
}

async function main() {
  await loadCommands();
  await loadEvents(); 

  const token = Deno.env.get("DISCORD_TOKEN");
  if (!token) {
    logger.error("DISCORD_TOKEN environment variable is not set.");
    Deno.exit(1);
  }

  try {
    await client.login(token);
  } catch (error) {
    logger.error("Failed to login to Discord:", error);
    Deno.exit(1);
  }
}

main();