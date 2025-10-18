'use strict'

const { Context, Schema } = require('koishi')

exports.name = 'koishi-plugin-strict-auth'
exports.usage = `
---

<p>本插件用于严格鉴权，普通群员无法调用敏感命令，群管/群主可调用。</p>
<p>权限 &gt;= 3 用户直接放行，其余用户根据群内身份判断是否有权限。</p>

---
<p>➣ <a href="https://github.com/DoomVoss/Koishi-Plugins-CBS" target="_blank">点我前往Github项目地址</a></p>

`;

exports.Config = Schema.object({
  CommandList: Schema.array(Schema.string())
    .description('需要调用命令者自身为管理员/群主才能执行的命令列表')
    .default(['kick', 'ban']),
  BotCheckList: Schema.array(Schema.string())
    .description('需要机器人自身为管理员才能执行的命令列表')
    .default(['kick', 'ban']),
});

exports.apply = function apply(ctx, config) {

  // 附加用户字段
  ctx.before('command/attach-user', (argv, fields) => {
    try {
      fields.add('id')
      fields.add('authority')
    } catch (e) {
      // 捕获异常，不影响主流程
    }
  })

  ctx.before('command/execute', async ({ session, command }) => {
    try {
      if (!session || !command) return
      const cmdName = command.name
      if (!cmdName) return

      const pluginCommands = config?.CommandList || []
      const botCheckCommands = config?.BotCheckList || []
      const inList = pluginCommands.includes(cmdName) || pluginCommands.some(p => cmdName === p || cmdName.startsWith(p + '.'))
      if (!inList) return

      const needBotCheck = botCheckCommands.includes(cmdName) || botCheckCommands.some(p => cmdName === p || cmdName.startsWith(p + '.'))
      const user = session.user || {}
      const authority = typeof user.authority === 'number' ? user.authority : (typeof session.authority === 'number' ? session.authority : 0)

      const isBotAdmin = async () => {
        try {
          if (session?.guildId && session?.selfId && session?.bot?.getGuildMember) {
            const guildMember = await session.bot.getGuildMember(session.guildId, session.selfId)
            if (guildMember) {
              let rolesCandidate = []
              if (Array.isArray(guildMember.roles)) rolesCandidate = guildMember.roles
              else if (typeof guildMember.role === 'string') rolesCandidate = [guildMember.role]
              else if (typeof guildMember.roles === 'string') rolesCandidate = guildMember.roles.split(',').map(s => s.trim())

              if (guildMember.user) {
                if (Array.isArray(guildMember.user.roles)) rolesCandidate = rolesCandidate.concat(guildMember.user.roles)
                else if (typeof guildMember.user.role === 'string') rolesCandidate.push(guildMember.user.role)
              }

              if (guildMember.isOwner || guildMember.is_admin || guildMember.isAdmin || guildMember.owner) return true
              const norm = rolesCandidate.map(r => String(r).toLowerCase())
              if (norm.includes('owner') || norm.includes('admin')) return true
              if (typeof guildMember.permission === 'string') {
                const p = guildMember.permission.toLowerCase()
                if (p.includes('owner') || p.includes('admin')) return true
              }
            }
          }

          // 判断机器人自身角色
          const botMember = session.event?.self || session.guild?.self || session.bot || {}
          let botRoles = []
          if (botMember) {
            if (Array.isArray(botMember.roles)) botRoles = botMember.roles
            else if (typeof botMember.role === 'string') botRoles = [botMember.role]
            else if (typeof botMember.roles === 'string') botRoles = botMember.roles.split(',').map(s => s.trim())
          }
          const normBotRoles = botRoles.map(r => String(r).toLowerCase())
          if (normBotRoles.includes('owner') || normBotRoles.includes('admin')) return true

          return false
        } catch (e) {
          return false
        }
      }

      if (authority >= 3) {
        if (needBotCheck) {
          if (await isBotAdmin()) return
          return '请给我管理权限喵~不然我没法帮你执行这个指令呢~(>﹏<)'
        }
        return
      }

      const member = session.event?.member
      let roles = []
      if (member) {
        if (Array.isArray(member.roles)) roles = member.roles
        else if (typeof member.role === 'string') roles = [member.role]
        else if (typeof member.roles === 'string') roles = member.roles.split(',').map(s => s.trim())
      }
      const normRoles = roles.map(r => String(r).toLowerCase())
      if (normRoles.includes('owner') || normRoles.includes('admin')) {
        if (needBotCheck) {
          if (await isBotAdmin()) return
          return '请给我管理权限喵~不然我没法帮你执行这个指令呢~(>﹏<)'
        }
        return
      }
     //直接返回字符串阻断指令执行（？
      return '喵~你没有权限执行这个指令啦！只有群主或管理员才可以哦~(ฅ>ω<ฅ)'
    } catch (err) {
      try { ctx.logger('strict-auth-plugin').warn('列表指令权限判断/拦截异常出错：', err) } catch (e) {}
      return
    }
  })
}
