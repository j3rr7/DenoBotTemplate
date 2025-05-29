# Template for [discord.js](https://discord.js.org/) using [Deno](https://deno.com/)

This repository provides a template for building Discord bots using [Deno](https://deno.com/) and the [Discord.js](https://discord.js.org/) library. This includes a structured folder layout, example commands, and event handling to help you get started quickly.

# Project Structure

```text
├── src
│   ├── commands
│   │   ├── ping.ts
│   │   └── sync-commands.ts
│   ├── events
│   │   ├── interactionCreate.ts
│   │   └── ready.ts
│   ├── utils
│   │   └── logger.ts
│   ├── bot.ts
│   ├── deploy-commands.ts
│   ├── index.ts
│   └── types.ts
├── .env
├── deno.json
└── deno.lock
```

# Getting Started

## Prerequisites

- [Deno](https://deno.com/) installed on your machine.
- A Discord bot token. You can create a bot and get the token from the [Discord Developer Portal.](https://discord.com/developers/applications)

# Installation

1. Clone the repository:
```bash
git clone https://github.com/j3rr7/DenoBotTemplate.git
```

2. Create a .env file in the root directory and add your Discord bot token:
```bash
DISCORD_TOKEN=INSERT_TOKEN_HERE
DISCORD_CLIENT_ID=INSERT_CLIENTID_HERE
APP_MODE=development  # for logging debug
```

3. Run Bot
```bash
deno task dev
```

# Contributing

Feel free to submit issues or pull requests to improve this template. Contributions are welcome!

# License

This project is licensed under the Unlicense License. See the [LICENSE](./LICENSE) file for details.