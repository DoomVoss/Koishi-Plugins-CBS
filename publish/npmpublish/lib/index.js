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

var name = "priv-broadcast";
var using = ["database"];
var Config = import_koishi.Schema.object({});

function buildMessageSegments(text, picUrl) {
  const segs = [];
  if (text) segs.push(text);
  if (picUrl) segs.push((0, import_koishi.h).image(picUrl));
  return segs.length ? segs : ["（空消息）"];
}
__name(buildMessageSegments, "buildMessageSegments");

async function sendGlobalBroadcast(bot, channelIds, segments, batchSize = 10) {
  let ok = 0, fail = 0;
  for (let i = 0; i < channelIds.length; i += batchSize) {
    const batch = channelIds.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map(cid => bot.sendMessage(cid, segments)));
    results.forEach(r => {
      if (r.status === "fulfilled") ok++;
      else fail++;
    });
    await new Promise(res => setTimeout(res, 500 + Math.random() * 500));
  }
  return { ok, fail };
}
__name(sendGlobalBroadcast, "sendGlobalBroadcast");

function apply(ctx) {
  ctx.command("broadcast", "管理员广播（私聊机器人使用）", { authority: 4 }).option("list", "-l <groupId:string>", { fallback: "" }).option("text", "-t [text:text]", { fallback: "" }).option("pic", "-p [url:string]", { fallback: "" }).option("only", "-o", { fallback: false }).usage([
    "用法：/broadcast -l [群号] -t [文本] -p [图片URL]",
    " - 文本与图片可二选一或同时发送（图文合并为一条消息）。",
    " - 仅发文本：不带 -p；仅发图片：不带 -t；图文同发：同时带 -t 与 -p。",
    " - 全局广播：去掉 -l [群号]，改为使用 -o。"
  ].join("\n")).example("/broadcast -l 123456 -t 你好世界").example("/broadcast -l 123456 -p https://example.com/a.jpg").example("/broadcast -o -t 公告 -p https://example.com/pic.png").action(async ({ session, options }) => {
    const { list, only, text, pic } = options;
    if (list && only)
      return session.send("参数冲突：-l 与 -o 不能同时使用。");
    if (!text && !pic)
      return session.send("请至少提供文本 (-t) 或图片 URL (-p) 之一。");
    const segments = buildMessageSegments(text, pic);
    if (list && !only) {
      try {
        await session.bot.sendMessage(list.trim(), segments);
        return session.send(`已向群 ${list.trim()} 发送完成。`);
      } catch (e) {
        ctx.logger("priv-broadcast").warn(e);
        return session.send(`向群 ${list.trim()} 发送失败：${e?.message || e}`);
      }
    }
    if (only && !list) {
      session.send("开始全局广播，请稍等...");
      try {
        const fields = ["id"];
        const channels = await ctx.database.getAssignedChannels(fields, { [session.platform]: [session.selfId] });
        const ids = channels.map((ch) => ch.id);
        if (!ids.length)
          return session.send("未找到可发送的群聊。");
        const { ok, fail } = await sendGlobalBroadcast(session.bot, ids, segments);
        return session.send(`全局广播完成：成功 ${ok}，失败 ${fail}`);
      } catch (err) {
        return session.send(`全局广播出现异常：${err?.message || err}`);
      }
    }
    return session.send("请使用 -l 指定群，或使用 -o 进行全局广播。");
  });
}
__name(apply, "apply");
