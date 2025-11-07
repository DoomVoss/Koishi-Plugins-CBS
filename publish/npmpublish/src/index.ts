import { Context, Schema, h, Bot, jsx } from 'koishi'

export const name = 'priv-broadcast'
export const using = ['database']

export interface Config {}
export const Config = Schema.object<Config>({})

function buildMessageSegments(text?: string, picUrl?: string) {
  const segs: any[] = []
  if (text) segs.push(text)
  if (picUrl) segs.push(h.image(picUrl))
  return segs.length ? segs : ['（空消息）']
}

async function sendForwardMessage(bot: Bot, channelId: string, segments: any[]) {
  await bot.sendMessage(
    channelId,
    jsx('message', {
      forward: true,
      children: segments.map(seg => jsx('message', { userId: bot.selfId, children: typeof seg === 'string' ? h.parse(seg) : seg }))
    })
  )
}

async function sendBroadcast(
  bot: Bot,
  channelIds: string[],
  segments: any[],
  combine: boolean,
  batchSize = 10
) {
  let ok = 0, fail = 0

  for (let i = 0; i < channelIds.length; i += batchSize) {
    const batch = channelIds.slice(i, i + batchSize)
    const results = await Promise.allSettled(
      batch.map(cid => combine ? sendForwardMessage(bot, cid, segments) : bot.sendMessage(cid, segments))
    )

    results.forEach(r => r.status === 'fulfilled' ? ok++ : fail++)
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000))
  }

  return { ok, fail }
}

export function apply(ctx: Context) {
  ctx
    .command('broadcast', '管理员广播（私聊机器人使用）', { authority: 4 })
    .option('list', '-l <groupIds:string>', { fallback: '' })
    .option('skip', '-k <groupIds:string>', { fallback: '' })
    .option('text', '-t [text:text]', { fallback: '' })
    .option('pic', '-p [url:string]', { fallback: '' })
    .option('only', '-o', { fallback: false })
    .option('combine', '-h', { fallback: false })
    .usage(
      [
        '用法：/broadcast -l [群号] -t [文本] -p [图片URL]',
        ' - 文本与图片可二选一或同时发送（默认单条发送，不生成合并转发消息）',
        ' - 带 -h 参数则生成QQ合并转发消息',
        ' - 全局广播：使用 -o，排除群号用 -k',
      ].join('\n')
    )
    .example('/broadcast -l 123456,654321 -t 柚子厨蒸鹅心')
    .action(async ({ session, options }) => {
      const { list, skip, text, pic, only, combine } = options

      if (list && only) return session.send('参数冲突：-l 与 -o 不能同时使用。')
      if (!text && !pic) return session.send('请至少提供文本 (-t) 或图片 URL (-p) 之一。')

      const segments = buildMessageSegments(text, pic)
      let targetGroups: string[] = []

      // 指定群广播
      if (list && !only) {
        targetGroups = list.split(',').map(id => id.trim())
      }

      // 全局广播
      if (only) {
        const fields = ['id']
        const channels = await ctx.database.getAssignedChannels(fields, { [session.platform]: [session.selfId] })
        targetGroups = channels.map(ch => ch.id.toString())

        // 排除 -k 指定群
        if (skip) {
          const skipGroups = skip.split(',').map(id => id.trim())
          targetGroups = targetGroups.filter(id => !skipGroups.includes(id))
        }
      }

      if (!targetGroups.length) return session.send('未找到目标群聊。')

      try {
        const { ok, fail } = await sendBroadcast(session.bot, targetGroups, segments, combine)
        return session.send(`广播完成：成功 ${ok}，失败 ${fail}`)
      } catch (err) {
        ctx.logger('priv-broadcast').warn(err)
        return session.send(`广播出现异常：${(err as any)?.message || err}`)
      }
    })
}
