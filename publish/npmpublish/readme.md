<!--
作者: Doom
用途: 插件说明通用文档模板
版本: 1.0.0
-->
# koishi-plugin-group-curfew

[![npm](https://img.shields.io/npm/v/koishi-plugin-group-curfew?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-group-curfew)

## 注意：该插件未经测试，欢迎您寻找问题并提出Issue

---

## 插件介绍
本插件用于 **Koishi 机器人框架**，允许设置宵禁时间段（定时禁言）。

- 强烈建议与插件 [**koishi-plugin-strict-auth**](https://www.npmjs.com/package/koishi-plugin-strict-auth) 配合使用

功能特性：

- 设置群聊每日宵禁时间段
- 自动在宵禁时间启用/解除全体禁言
- 支持跨天宵禁
- 状态存储在 JSON 文件，机器人重启后自动恢复

---

## 插件配置项说明
> 本插件暂不需要用户配置，全部行为通过指令控制。

| 配置项 | 类型 | 默认值 | 说明 |
|:------|:------|:------|:------|
| （无配置项） | - | - | 插件无需用户配置 |

---

## 使用指令

| 指令 | 说明 |
|:------|:------|
| /bantime <开始时间> <结束时间> | 设置每日宵禁时间，格式 HH:MM（24 小时制） |
| /unbantime | 删除当前群的宵禁规则并解除全体禁言 |

示例：

/bantime 23:00 07:00
/unbantime

> 当安装了 `koishi-plugin-strict-auth` 可选依赖时，只有群主或管理员可以使用这些指令。  

---

## 帮助与反馈

- 如有Bug请前往[Github项目主页](https://github.com/DoomVoss/Koishi-Plugins-CBS)提交Issue

---

<details>
<summary>点击此处 可查看更新日志</summary>

-   **1.0.0**
    -   首次上传插件

</details>  