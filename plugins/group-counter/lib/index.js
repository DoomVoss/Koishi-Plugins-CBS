'use strict'

const { Context, Schema } = require('koishi')

exports.name = 'group-counter'
exports.usage = `
## 插件使用说明

- **用法**: 
  输入以下命令来查询机器人所在群聊列表，最大人数表示仅查询输出小于等于该人数的群聊：
  \`\`\`
  群人数 <最大人数（可为空）>
  \`\`\`

- 如有Bug请前往Github项目主页提交Issue

---
<p>➣ <a href="https://github.com/DoomVoss/Koishi-Plugins-CBS" target="_blank">点我前往Github项目地址</a></p>

`;

exports.Config = Schema.object({})

exports.apply = (ctx) => {
  ctx
    .command('群人数 [maxCount:number]', '查询机器人所在群及人数，传入人数参数时只返回人数小于等于该值的群聊，默认返回全部')
    .action(async ({ session }, maxCount) => {
      const bot = session.bot
      if (!bot.internal || typeof bot.internal._request !== 'function') {
        return '当前Onebot适配器不支持接口调用，请前往本Github项目主页提交Issue以帮助我们完善该插件！'
      }

      const limit = limitConcurrency(5)

      try {
        const groupListResp = await bot.internal._request('get_group_list', {})
        const groups = groupListResp.data || []
        const totalGroups = groups.length
        if (totalGroups === 0) {
          return '当前未加入任何群聊'
        }

        await session.send(`正在查询群人数${maxCount ? `（只返回人数≤${maxCount}的群）` : '，返回全部群'}，请稍等...`)
        const results = []

        await Promise.all(groups.map(group => limit(async () => {
          try {
            const memberInfoResp = await bot.internal._request('get_group_member_info', {
              group_id: group.group_id,
              user_id: bot.selfId,
            })
            if (!memberInfoResp.data) return

            const infoResp = await bot.internal._request('get_group_info', {
              group_id: group.group_id,
              no_cache: true,
            })
            const count = infoResp.data?.member_count ?? 0
            if (maxCount === undefined || count <= maxCount) {
              results.push(`群号：${group.group_id}，群名：${group.group_name}，人数：${count}`)
            }
          } catch {}
        })))

        let header = `机器人当前所在群总数：${totalGroups}，`
        header += maxCount !== undefined
          ? `人数小于等于${maxCount}的群数量：${results.length}\n`
          : `群列表如下：\n`

        if (results.length === 0 && maxCount !== undefined) {
          return header + `没有找到符合条件的群聊（`
        }

        const MAX_LEN = 1200
        let buffer = header
        for (const line of results) {
          if ((buffer + line + '\n').length > MAX_LEN) {
            await session.send(segment.escape(buffer))
            buffer = ''
          }
          buffer += line + '\n'
        }
        if (buffer.length) await session.send(segment.escape(buffer))
      } catch (error) {
        ctx.logger('group-counter').warn('获取群人数失败', error)
        return '获取群人数失败，未知原因，try again；）'
      }
    })
}

// 限流函数
function limitConcurrency(concurrency) {
  const queue = []
  let activeCount = 0

  const next = () => {
    if (queue.length === 0 || activeCount >= concurrency) return
    activeCount++
    const fn = queue.shift()
    fn().finally(() => {
      activeCount--
      next()
    })
  }

  return (fn) => new Promise((resolve, reject) => {
    queue.push(() => fn().then(resolve).catch(reject))
    next()
  })
}
