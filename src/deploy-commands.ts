import { REST, Routes } from "discord.js";
import logger from "./utils/logger.ts";

const token = Deno.env.get("DISCORD_TOKEN");
const clientId = Deno.env.get("DISCORD_CLIENT_ID");
// const guildId = Deno.env.get("DEV_GUILD_ID"); // Optional: for guild-specific initial deploy

if (!token || !clientId) {
  logger.error(
    "Missing DISCORD_TOKEN or DISCORD_CLIENT_ID for deployment script.",
  );
  Deno.exit(1);
}

const commands = [
  {
    name: "sync-commands",
    description:
      "Synchronizes application (/) commands for this server (Admin only).",
  },
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    logger.info(
      "Started refreshing application (/) commands for initial deployment.",
    );

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
    logger.info("Successfully reloaded application (/) commands globally.");

    // OR for a specific guild (updates instantly - better for dev/initial sync command)
    // if (guildId) {
    //   await rest.put(
    //     Routes.applicationGuildCommands(clientId, guildId),
    //     { body: commands },
    //   );
    //   logger.info(
    //     `Successfully reloaded application (/) commands for guild ${guildId}.`,
    //   );
    // } else {
    //   logger.warn(
    //     "No DEV_GUILD_ID set, deploying globally or skipping guild deployment.",
    //   );
    // }
  } catch (error) {
    logger.error("Error during initial command deployment:", error);
  }
})();
