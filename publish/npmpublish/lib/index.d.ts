import { Context, Schema } from 'koishi';

export const name = "fakemsg";

export interface Config {
  userSplit: string;
  messageSplit: string;
  blockedUsers: string[];
  adminUsers: string[];
  maxDailySubmits: number;
}

export const Config: Schema<Config>;

export function apply(ctx: Context, config: Config): void;
