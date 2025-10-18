# koishi-plugin-strict-auth

[![npm](https://img.shields.io/npm/v/koishi-plugin-strict-auth?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-strict-auth)

# Koishi严格鉴权插件使用说明

- 检测到 `BotCheckList` 列表中的指令时，判断机器人在当前群是否具有管理权限
- 检测到 `CommandList` 列表中的指令时，判断用户是否具有管理权限
- 本插件支持 `Onebot` 协议，在 `Lagrange` 与 `Napcat` 适配器均测试成功
适用于希望强化群聊管理、避免普通用户误操作或恶意操作的场景。

---

## 使用说明

- **用法**: 

1. 在插件配置中配置 `CommandList` 与 `BotCheckList` 列表，填写相应的指令名称

> CommandList：用户调用时必须具有群管理权限，否则指令将被阻止

> BotCheckList：机器人执行指令前必须检查自身权限

2. 配置后保存并重载插件即可生效

3. 当调用列表内指令时将通过 `ctx.before` 检查相应权限并决定是否调用

---

## 帮助与反馈

- 如有Bug请前往[Github项目主页](https://github.com/DoomVoss/Koishi-Plugins-CBS)提交Issue

---

<details>
<summary>点击此处 可查看更新日志</summary>

-   **1.0.0**
    -   首次上传插件

</details>  