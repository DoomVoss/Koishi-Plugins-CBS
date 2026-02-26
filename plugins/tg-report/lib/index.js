'use strict'
const { Schema, h } = require("koishi");
exports.name = "tg-report";

exports.usage = `
---
<p>无实际用途，模仿tg的report命令，引用回复发送者“已举报给管理员。”</p>
---
<p>➣ <a href="https://github.com/DoomVoss/Koishi-Plugins-CBS" target="_blank">点我前往Github项目地址</a></p>
`
exports.Config = Schema.object({});
exports.apply = (ctx) => {
  ctx.command('report', '举报')
    .action(async ({ session }) => {
      if (!session?.messageId) return;
      return h.quote(session.messageId) + "已举报给管理员。";
    });
};