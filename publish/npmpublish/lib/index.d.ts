import { Context, Schema } from 'koishi'

export const name: string
export const usage: string
export const Config: Schema<Record<string, never>>

export function apply(ctx: Context): void
