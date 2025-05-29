// deno-lint-ignore-file no-explicit-any
import { Client, Collection } from 'discord.js';

export type BotClientType = Client & {
  commands: Collection<string, Command>;
};

export interface Command {
  name: string;
  description: string;
  execute: (client: BotClientType, ...args: any[]) => Promise<void> | void;
}

export interface Event {
  name: string;
  once?: boolean;
  execute: (client: BotClientType, ...args: any[]) => Promise<void> | void;
}

