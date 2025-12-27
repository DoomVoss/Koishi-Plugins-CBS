<!--
作者: Doom
用途: 插件说明通用文档模板
版本: 1.0.0
-->
# koishi-plugin-auto-welcome

[![npm](https://img.shields.io/npm/v/koishi-plugin-auto-welcome?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-auto-welcome)

## 注意：该插件为自用插件
## 如需使用请自行修改源码！

## 插件介绍
本插件用于 **Koishi 机器人框架**，允许在群聊中通过指令设置群成员入群欢迎信息。  
支持以下功能：

- 欢迎信息支持发送图文消息  
- 各群聊单独设置，互不影响    
- 图片存储集中，URL图片发送

---

## 插件配置项说明
> 以下配置项说明将同时体现在源码注释中。

| 配置项 | 类型 | 默认值 | 说明 |
|:------|:------|:------|:------|
| EnterSendMsg | 文本 | - | 机器人入群欢迎文本，支持换行符 |

---

## 使用指令

| 参数 | 说明 |
|:------|:------|
| `-s` | 设置欢迎文本 |
| `-p` | 设置欢迎图片 |
| `-t` | 测试欢迎信息 |
| `-r` | 清除欢迎信息 |


**示例**：

  ```
  /welcome -s 欢迎入群，请查看群公告！
  /welcome -p （在下一条消息发送图片）
  ```

---

## 帮助与反馈

- 如有Bug请前往[Github项目主页](https://github.com/DoomVoss/Koishi-Plugins-CBS)提交Issue

---

<details>
<summary>点击此处 可查看更新日志</summary>

-   **1.0.0**
    -   首次上传插件

</details>  