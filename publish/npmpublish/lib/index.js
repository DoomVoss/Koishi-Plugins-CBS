'use strict'

const { Context, Schema } = require('koishi')

exports.name = 'koishi-plugin-dispose-group'
exports.usage = `
## 插件使用说明

### 重要
- 请在Koishi插件配置项中**过滤器设置 → 添加条件 → 用户ID等于管理员QQ号**，否则所有人都能私聊机器人调用该指令！
- 免责声明：由于未按以上要求配置造成损失的，与我无瓜）

### 使用说明
- **用法**: 
  管理员在聊天窗口中输入以下命令来退出指定群聊：
  \`\`\`
  dispose <QQ群号> <自定义退群前发送文本（留空则使用插件配置项中默认文本）>
  \`\`\`

- 如有Bug请前往Github项目主页提交Issue

---
<p>➣ <a href="https://github.com/DoomVoss/Koishi-Plugins-CBS" target="_blank">点我前往Github项目地址</a></p>

`;


exports.Config = Schema.object({
  defaultMessage: Schema.string().description('默认发送的退群前文本').default('将退出该群。原因：未给出'),
})

exports.apply = function apply(ctx, config) {
  const logger = ctx.logger('dispose')

  ctx.command('dispose <groupId:string> [message:text]', '让机器人发送文本并退出指定群')
    .usage('仅限管理员私聊使用，用于退群并在退群前发送一段文字')
    .action(async ({ session }, groupId, message) => {
      if (session.subtype !== 'private') {
        return '该指令只能在私聊中使用。'
      }

      if (!groupId) {
        return '请输入群号。'
      }

      const bot = session.bot
      const text = message?.trim() || config.defaultMessage

      try {
        if (text) {
          await bot.sendMessage(groupId, text)
        }
      } catch (err) {
        logger.warn(`向群 ${groupId} 发送消息失败：${err.message}`)
        return '消息发送失败，机器人可能未在该群或无权限。'
      }

      try {
        await bot.internal.setGroupLeave(groupId, false)
        logger.info(`已退出群 ${groupId}`)
        return `已发送消息并退出群 ${groupId}`
      } catch (err) {
        logger.error(`退出群 ${groupId} 失败：${err.message}`)
        return '退群失败，可能无权限或机器人未加入该群。'
      }
    })
}
