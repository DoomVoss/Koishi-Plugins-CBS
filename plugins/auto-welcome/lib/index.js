'use strict'

const { Context, Schema, h } = require('koishi')
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

/**
 * 注意：
 * 【该插件为自用插件】
 * 
 * 该插件仅适用于以下环境
 * 保存文件目录为静态网站
 * 可通过修改源码实现
 *
 */

const SAVE_DIR = '/koishi/aw'
const BASE_URL = 'http(s)://example.com/'
const DATA_PATH = path.join(__dirname, 'welcome-data.json')

function loadData() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(
        DATA_PATH,
        JSON.stringify({ texts: {}, images: {}, waitForImage: {} }, null, 2)
      )
    }
    return JSON.parse(fs.readFileSync(DATA_PATH))
  } catch {
    return { texts: {}, images: {}, waitForImage: {} }
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

// 封装下载图片函数
async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`下载失败: ${res.statusCode}`))
      const fileStream = fs.createWriteStream(dest)
      res.pipe(fileStream)
      fileStream.on('finish', () => fileStream.close(resolve))
      fileStream.on('error', reject)
    }).on('error', reject)
  })
}

// 插件注册
exports.name = 'koishi-plugin-auto-welcome'
exports.usage = '【自用插件】支持群内设置欢迎语与欢迎图片，并写入宿主机目录保存'

exports.Config = Schema.object({
  EnterSendMsg: Schema.string().description('机器人入群欢迎文本，支持换行（使用 \\n）')
})

exports.apply = function apply(ctx, config) {
  const logger = ctx.logger('auto-welcome')
  let data = loadData()

  // 机器人入群通知
  ctx.on('guild-added', async (session) => {
    if (!session.guildId) return
    try {
      let msg = config.EnterSendMsg.replace(/\\n/g, '\n')
      await session.send(msg)
    } catch (e) {
      logger.warn(`发送机器人入群通知失败: ${e.message}`)
    }
  })

  // 群聊新成员入群通知
  ctx.on('guild-member-added', async (session) => {
  const { guildId, userId } = session
  if (!guildId || !userId) return

  const text = data.texts[guildId]
  if (!text) return

  const image = data.images[guildId]
  const welcomeText = text.replace('{user}', userId).replace('{group}', guildId)

  const msg = [h('at', { id: userId }), ' ', welcomeText]

  if (image) {msg.push(h('image', { url: image }))}

  await session.send(msg)
})

ctx.on('guild-member-deleted', async (session) => {
  const { guildId, userId } = session
  if (!guildId || !userId) return
  if (!data.texts[guildId]) return
  await session.send(`用户 ${userId} 退出了本群喵...`)
})

  // 命令注册
  ctx.command('welcome', '设置欢迎信息')
    .option('s', '-s <消息> 设置欢迎语')
    .option('r', '-r 移除欢迎配置')
    .option('t', '-t 测试欢迎语')
    .option('p', '-p 设置欢迎图片')
    .action(async ({ session, options }) => {
      const guildId = session.guildId
      if (!guildId) return '喵呜...这个命令只能在群里用喵...'

      if (options.s !== undefined) {
        const text = options.s.trim()
        if (!text) return '欢迎语不能为空喵~'
        data.texts[guildId] = text
        saveData(data)
        return '已经设置好欢迎语啦喵，要不要用 /welcome -t 试试看效果呀？'
      }

      if (options.r) {
        delete data.texts[guildId]
        delete data.images[guildId]
        saveData(data)
        return '欢迎语已经被我吃掉啦喵~'
      }

      if (options.t) {
        const text = data.texts[guildId]
        if (!text) return '本群尚未设置欢迎语喵...'
        const userId = session.userId
        const result = text.replace('{user}', userId).replace('{group}', guildId)
        const msg = [h('at', { id: userId }), ' ', result]
        if (data.images[guildId]) msg.push(h('image', { url: data.images[guildId] }))
        return msg
      }

      if (options.p) {
        data.waitForImage[session.userId] = guildId
        saveData(data)
        return '请在下一条消息发送图片喵'
      }

      return `当前欢迎语：${data.texts[guildId] || '未设置'}
当前欢迎图片：${data.images[guildId] || '未设置'}

指令列表：
welcome -s 文本   设置欢迎语
welcome -r        移除欢迎语与图片
welcome -t        测试欢迎设置
welcome -p        设置欢迎图片（消息发送）`
    })

  // 监听消息 处理图片
  ctx.middleware(async (session, next) => {
    if (!session.guildId || !session.userId) return next()
    const waitGuild = data.waitForImage[session.userId]
    if (!waitGuild) return next()

    const msg = (session.content || '').trim()

    function extractImageFromSession() {
      if (Array.isArray(session.elements)) {
        for (const e of session.elements) {
          if (!e || !e.type) continue
          const t = String(e.type).toLowerCase()
          if (['image', 'img', 'picture', 'photo', 'image-node'].includes(t)) {
            if (e.attrs && (e.attrs.url || e.attrs.file || e.attrs.src)) {
              return e.attrs.url || e.attrs.src || e.attrs.file
            }
            if (e.url) return e.url
            if (e.file) return e.file
            if (e.content) return e.content
          }
        }
      }

      const cqMatch = msg.match(/\[CQ:image[^\]]*?(?:file=([^,\]\s]+))?(?:,?url=([^,\]\s]+))?/i)
      if (cqMatch) {
        if (cqMatch[2]) return cqMatch[2]
        if (cqMatch[1]) return cqMatch[1]
      }

      const mdMatch = msg.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/i)
      if (mdMatch) return mdMatch[1]

      const urlMatch = msg.match(/(https?:\/\/\S+\.(?:png|jpe?g|gif|webp|bmp)(?:\?\S*)?)/i)
      if (urlMatch) return urlMatch[1]

      const genericUrl = msg.match(/(https?:\/\/\S+)/i)
      if (genericUrl) return genericUrl[1]

      if (session.attachments && Array.isArray(session.attachments) && session.attachments.length) {
        const a = session.attachments[0]
        if (a.url) return a.url
        if (a.file) return a.file
      }
      return null
    }

    const imageUrl = extractImageFromSession()
    if (!imageUrl) {
      delete data.waitForImage[session.userId]
      saveData(data)
      await session.send('设置失败了喵...请发送图片喵~')
      return
    }

    // 下载图片到宿主机
    if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true })
    const ext = path.extname(imageUrl).split('?')[0] || '.jpg'
    const localFile = path.join(SAVE_DIR, `${waitGuild}_${Date.now()}${ext}`)

    try {
      if (/^https?:\/\//.test(imageUrl)) {
        await downloadImage(imageUrl, localFile)
      } else if (session.bot.uploadFile || session.bot.upload) {
        const tempFile = localFile // 先保存到宿主机
        fs.copyFileSync(tempFile, localFile) // 保留原文件
      } else {
        throw new Error('无法识别图片来源')
      }
    } catch (e) {
      delete data.waitForImage[session.userId]
      saveData(data)
      logger.warn('下载图片失败: %o', e.message || e)
      await session.send('下载图片失败喵，请重试~')
      return
    }

    // 保存图片 URL
    const finalUrl = `${BASE_URL}/${path.basename(localFile)}`
    data.images[waitGuild] = finalUrl
    delete data.waitForImage[session.userId]
    saveData(data)

    await session.send('欢迎图片设置成功了喵~')
  })
}
