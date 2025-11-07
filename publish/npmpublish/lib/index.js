"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && (typeof from === "object" || typeof from === "function")) {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  name: () => name,
  using: () => using
});
module.exports = __toCommonJS(src_exports);

var import_koishi = require("koishi");
var import_jsx = require("@satorijs/element/jsx-runtime");

var name = "priv-broadcast";
var using = ["database"];
var Config = import_koishi.Schema.object({});

function buildMessageSegments(text, picUrl) {
  const segs = [];
  if (text) segs.push(text);
  if (picUrl) segs.push(import_koishi.h.image(picUrl));
  return segs.length ? segs : ["（空消息）"];
}
__name(buildMessageSegments, "buildMessageSegments");

async function sendForwardMessage(bot, channelId, segments) {
  await bot.sendMessage(
    channelId,
    (0, import_jsx.jsx)("message", {
      forward: true,
      children: segments.map(seg => (0, import_jsx.jsx)("message", {
        userId: bot.selfId,
        children: typeof seg === "string" ? import_koishi.h.parse(seg) : seg
      }))
    })
  );
}
__name(sendForwardMessage, "sendForwardMessage");

async function sendBroadcast(bot, channelIds, segments, combine, batchSize = 10) {
  let ok = 0, fail = 0;
  for (let i = 0; i < channelIds.length; i += batchSize) {
    const batch = channelIds.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(cid => combine ? sendForwardMessage(bot, cid, segments) : bot.sendMessage(cid, segments))
    );
    results.forEach(r => r.status === "fulfilled" ? ok++ : fail++);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
  }
  return { ok, fail };
}
__name(sendBroadcast, "sendBroadcast");

function apply(ctx) {
  ctx.command("broadcast", "管理员广播（私聊机器人使用）", { authority: 4 })
    .option("list", "-l <groupIds:string>", { fallback: "" })
    .option("skip", "-k <groupIds:string>", { fallback: "" })
    .option("text", "-t [text:text]", { fallback: "" })
    .option("pic", "-p [url:string]", { fallback: "" })
    .option("only", "-o", { fallback: false })
    .option("combine", "-h", { fallback: false })
    .usage([
      "用法：/broadcast -l [群号] -t [文本] -p [图片URL]",
      " - 默认发送图文结合消息",
      " - 带 -h 参数则发送QQ合并转发消息",
      " - 全局广播：使用 -o，排除群号用 -k"
    ].join("\n"))
    .example("/broadcast -l 123456,654321 -t 柚子厨蒸鹅心")
    .action(async ({ session, options }) => {
      const { list, skip, text, pic, only, combine } = options;
      if (list && only) return session.send("参数冲突：-l 与 -o 不能同时使用。");
      if (!text && !pic) return session.send("请至少提供文本 (-t) 或图片 URL (-p) 之一。");

      const segments = buildMessageSegments(text, pic);
      let targetGroups = [];

      // 指定群广播
      if (list && !only) {
        targetGroups = list.split(",").map(id => id.trim());
      }

      // 全局广播
      if (only) {
        const fields = ["id"];
        const channels = await ctx.database.getAssignedChannels(fields, { [session.platform]: [session.selfId] });
        targetGroups = channels.map(ch => ch.id.toString());

        if (skip) {
          const skipGroups = skip.split(",").map(id => id.trim());
          targetGroups = targetGroups.filter(id => !skipGroups.includes(id));
        }
      }

      if (!targetGroups.length) return session.send("未找到目标群聊。");

      try {
        const { ok, fail } = await sendBroadcast(session.bot, targetGroups, segments, combine);
        return session.send(`广播完成：成功 ${ok}，失败 ${fail}`);
      } catch (err) {
        ctx.logger("priv-broadcast").warn(err);
        return session.send(`广播出现异常：${err?.message || err}`);
      }
    });
}
__name(apply, "apply");
