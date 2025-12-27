import { Schema } from 'koishi'

export const name = 'koishi-plugin-auto-welcome'

export interface Config {
  whitelist: string[]
  welcomeTexts: Record<string, string>
  welcomeImages: Record<string, string>
}

export const Config: Schema<Config>
