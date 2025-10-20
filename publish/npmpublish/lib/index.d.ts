import { Context, Schema, Bot } from 'koishi'

export const name = 'priv-broadcast'
export const using: string[]

export interface Config {}
export const Config: Schema<Config>

export function buildMessageSegments(text?: string, picUrl?: string): any[]
export function sendGlobalBroadcast(
  bot: Bot,
  channelIds: string[],
  segments: any[],
  batchSize?: number,
): Promise<{ ok: number; fail: number }>
export function apply(ctx: Context): void