'use strict'

const { Schema, segment, h } = require("koishi");

exports.name = "fakemsg-admin";

exports.usage = `
---

<p>不知道写点啥:）</p>

---

<p>➣ <a href="https://github.com/DoomVoss/Koishi-Plugins-CBS" target="_blank">点我前往Github项目地址</a></p>
`

exports.Config = Schema.object({
  userSplit: Schema.string().default("|").description("用户消息分隔符"),
  messageSplit: Schema.string().default(" ").description("同一用户多条消息分隔符"),
  blockedUsers: Schema.array(Schema.string()).default([]).description("被屏蔽的QQ号列表"),
  adminUsers: Schema.array(Schema.string()).default([]).description("管理员QQ列表"),
  maxDailySubmits: Schema.number().default(2).description("用户每日最大伪造申请次数")
});

exports.apply = (ctx, config) => {
  const pendingReviewMap = new Map();
  const userUsageMap = new Map();
  let requestIndex = 1;

  const isUserBlocked = (userId) => config.blockedUsers.includes(userId);
  const isAdmin = (userId) => config.adminUsers.includes(userId);
  const getToday = () => new Date().toISOString().slice(0, 10);

  ctx.command('fakemsg <content:text>', '申请伪造消息')
    .usage('使用方式：fakemsg 114514说你好|1919810说收到 -r 测试用途')
    .option('remark', '-r <remark:string> 备注说明', { fallback: '无备注' })
    .action(async ({ session, options }, content) => {

      if (!content) return `【用户操作流程】
发送伪造申请格式
示例：fakemsg 114514说Hello|1919810说World（数字部分为QQ号，“说”字后为消息内容，多条消息用“|”分隔；同一用户多条消息用空格分隔）。`;
      if (isUserBlocked(session.userId)) return '您已被限制使用该功能。';

      const today = getToday();
      let usage = userUsageMap.get(session.userId);
      
      if (!usage || usage.date !== today) {
        usage = { date: today, count: 0 };
      }

      if (usage.count >= config.maxDailySubmits) {
        return `你今日的伪造消息申请次数已达上限（${config.maxDailySubmits}次），请明天再试。`;
      }

      const fakeMessages = [];
      const userMessages = content.split(config.userSplit);

      for (const userMsg of userMessages) {
        const trimmedMsg = userMsg.trim();
        if (!trimmedMsg || !trimmedMsg.includes("说")) continue;
        
        const splitIndex = trimmedMsg.indexOf("说");
        const userQQ = trimmedMsg.substring(0, splitIndex);
        const message = trimmedMsg.substring(splitIndex + 1);

        if (!userQQ || !message) continue;
        if (!/^\d+$/.test(userQQ)) continue;

        if (isUserBlocked(userQQ)) {
          return `QQ号 ${userQQ} 已被屏蔽，无法伪造。`;
        }

        try {
          let nickname = userQQ;
          try {
            const userInfo = await session.bot.getUser(userQQ);
            if (userInfo && userInfo.name) nickname = userInfo.name;
          } catch {}

          const msgs = message.split(config.messageSplit);
          for (const msg of msgs) {
            if (msg.trim()) {
              fakeMessages.push({
                userId: userQQ,
                nickname: nickname,
                content: msg.trim()
              });
            }
          }
        } catch (e) {
          return `解析失败：${e.message}`;
        }
      }

      if (fakeMessages.length === 0) {
        return '格式错误或未包含有效内容。';
      }

      usage.count++;
      userUsageMap.set(session.userId, usage);

      const requestId = (requestIndex++).toString();
      const groupId = session.subtype === "group" ? session.guildId || session.groupId : "私聊";
      
      pendingReviewMap.set(requestId, {
        session, 
        fakeMessages,
        userId: session.userId,
        requestTime: Date.now(),
        rawContent: content,
        remark: options.remark,
        groupId
      });

      const adminMsg = [
        `【伪造消息审核请求】`,
        `序号：${requestId}`,
        `用户：${session.userId} (${session.username || '未知'})`,
        `群组：${groupId}`,
        `备注：${options.remark}`,
        `内容：${content}`,
        `---`,
        `通过：fake.pass ${requestId}`,
        `拒绝：fake.deny ${requestId} 理由`
      ].join('\n');

      for (const adminId of config.adminUsers) {
        try {
          await session.bot.sendPrivateMessage(adminId, adminMsg);
        } catch (e) {
          console.error("[FakeMessage] 发送管理员通知失败:", e);
        }
      }

      return [
        h.quote(session.messageId),
        `申请已提交 (序号 ${requestId})，请等待管理员审核。`,
        `今日剩余使用次数：${config.maxDailySubmits - usage.count}`
      ].join('\n');
    });



  ctx.command('fake.pass <requestId>', '通过伪造申请', { hidden: true })
    .action(async ({ session }, requestId) => {
      if (!isAdmin(session.userId)) return;
      if (!requestId) return '请输入申请序号';

      const data = pendingReviewMap.get(requestId);
      if (!data) return '未找到该申请或已过期。';

      try {
        await sendForwardMessage(data.session, data.fakeMessages);
        
        await data.session.send([
          segment.at(data.userId), 
          ` 您的申请 (序号 ${requestId}) 已通过。`
        ]);

        pendingReviewMap.delete(requestId);
        return `申请 ${requestId} 已通过。`;
      } catch (e) {
        return `执行失败：${e.message}`;
      }
    });

  ctx.command('fake.deny <requestId> [reason:text]', '拒绝伪造申请', { hidden: true })
    .action(async ({ session }, requestId, reason) => {
      if (!isAdmin(session.userId)) return;
      if (!requestId) return '请输入申请序号';

      const data = pendingReviewMap.get(requestId);
      if (!data) return '未找到该申请。';

      try {
        await data.session.send([
          segment.at(data.userId),
          ` 您的申请 (序号 ${requestId}) 被拒绝。理由：${reason || '无'}`
        ]);

        pendingReviewMap.delete(requestId);
        return `申请 ${requestId} 已拒绝。`;
      } catch (e) {
        return `操作失败：${e.message}`;
      }
    });

  async function sendForwardMessage(session, messages) {
    try {
      const nodes = messages.map((msg) => ({
        type: "node",
        data: {
          name: msg.nickname,
          uin: msg.userId,
          content: String(msg.content)
        }
      }));

      if (session.subtype === "group") {
        await session.bot.internal.sendGroupForwardMsg(session.guildId, nodes);
      } else {
        await session.bot.internal.sendPrivateForwardMsg(session.userId, nodes);
      }
    } catch (e) {
      console.error("[FakeMessage] 发送合并转发失败:", e);
      await session.send("合并转发失败，尝试逐条发送...");
      for (const msg of messages) {
        await new Promise(r => setTimeout(r, 500)); 
        await session.send(`${msg.nickname}: ${msg.content}`);
      }
    }
  }
};