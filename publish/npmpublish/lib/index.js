'use strict'

const { Context, Schema } = require('koishi')
const fs = require('fs')
const path = require('path')

exports.name = 'koishi-plugin-group-curfew'

exports.usage = `
---

<p>本插件提供群聊“每日定时全体禁言/解除”功能。</p>
<p>宵禁规则（开始时间 / 结束时间）存储在 JSON 文件中，机器人重启后自动恢复。</p>

---

<p>➣ <a href="https://github.com/DoomVoss/Koishi-Plugins-CBS" target="_blank">点我前往Github项目地址</a></p>
`

exports.Config = Schema.object({})

const JSON_PATH = path.join(process.cwd(), 'group-curfew-rules.json')

// 读写JSON
function loadRules() {
  if (!fs.existsSync(JSON_PATH)) return {}
  const content = fs.readFileSync(JSON_PATH, 'utf8')
  return content ? JSON.parse(content) : {}
}

function saveRules(obj) {
  fs.writeFileSync(JSON_PATH, JSON.stringify(obj, null, 2), 'utf8')
}

function parseTimeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function inCurfew(nowMin, startMin, endMin) {
  return startMin < endMin ? nowMin >= startMin && nowMin < endMin : nowMin >= startMin || nowMin < endMin
}

function nowMinutesUTC8() {
  const now = new Date()
  const hours = (now.getUTCHours() + 8) % 24
  return hours * 60 + now.getUTCMinutes()
}

exports.meta = {
  optionalDependencies: ['koishi-plugin-strict-auth']
}

exports.apply = function apply(ctx) {
  const status = new Map()
  const rules = loadRules()

  // ---- 可选依赖鉴权 ----
  const strictAuth = ctx.plugin('koishi-plugin-strict-auth')

  ctx.on('ready', async () => {
    const nowMin = nowMinutesUTC8()
    for (const guildId in rules) {
      const { start, end } = rules[guildId]
      const should = inCurfew(nowMin, parseTimeToMinutes(start), parseTimeToMinutes(end))
      status.set(guildId, should)
      ctx.bots[0].internal.setGroupWholeBan(guildId, should).catch(err => console.error('设置全体禁言失败:', err.message))
    }
  })

  ctx.command('bantime <start:string> <end:string>', '设置每日宵禁时间')
    .check(async ({ session }) => {
      if (!strictAuth) return true
      const res = await strictAuth.checkUserAuthority(session)
      return typeof res === 'string' ? res : true
    })
    .action(async ({ session }, start, end) => {
      if (!session.guildId) return '请在群聊中使用此指令'
      const timeRe = /^(?:[01]?\d|2[0-3]):[0-5]\d$/
      if (!timeRe.test(start) || !timeRe.test(end)) return '时间格式错误，请使用 HH:MM（24 小时制）'
      if (start === end) return '开始时间与结束时间相同，无法生效'

      const guildId = session.guildId
      rules[guildId] = { start, end }
      saveRules(rules)

      const nowMin = nowMinutesUTC8()
      const shouldBan = inCurfew(nowMin, parseTimeToMinutes(start), parseTimeToMinutes(end))
      status.set(guildId, shouldBan)

      await session.bot.internal.setGroupWholeBan(guildId, shouldBan)

      return `已设置宵禁：每日 ${start} ~ ${end} 自动开启全体禁言`
    })

  ctx.command('unbantime', '删除当前群的宵禁规则')
    .check(async ({ session }) => {
      if (!strictAuth) return true
      const res = await strictAuth.checkUserAuthority(session)
      return typeof res === 'string' ? res : true
    })
    .action(async ({ session }) => {
      const guildId = session.guildId
      if (!guildId) return '请在群聊中使用此指令'
      if (!rules[guildId]) return '本群尚未设置宵禁'

      delete rules[guildId]
      saveRules(rules)
      status.set(guildId, false)

      await session.bot.internal.setGroupWholeBan(guildId, false)

      return '已取消本群宵禁规则，并关闭全体禁言'
    })

  ctx.setInterval(async () => {
    const nowMin = nowMinutesUTC8()
    for (const guildId in rules) {
      const { start, end } = rules[guildId]
      const shouldBan = inCurfew(nowMin, parseTimeToMinutes(start), parseTimeToMinutes(end))
      const last = status.get(guildId)

      if (shouldBan !== last) {
        status.set(guildId, shouldBan)
        const msg = shouldBan
          ? '喵~全体禁言时间到啦，大家早点休息~'
          : (() => {
              const startMin = parseTimeToMinutes(start)
              const endMin = parseTimeToMinutes(end)
              if (startMin > endMin) return '喵喵！夜间宵禁已结束，可以聊天啦~'
              return '喵喵！全体禁言已解除，可以聊天啦~'
            })()
        ctx.bots[0].internal.setGroupWholeBan(guildId, shouldBan)
          .then(() => ctx.bots[0].sendMessage(guildId, msg))
          .catch(err => console.error(`群 ${guildId} 操作失败:`, err.message))
      }
    }
  }, 60 * 1000)
}
