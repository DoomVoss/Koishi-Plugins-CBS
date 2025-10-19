# koishi-plugin-priv-broadcast

[![npm](https://img.shields.io/npm/v/koishi-plugin-priv-broadcast?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-priv-broadcast)

## 插件介绍
本插件用于 **Koishi 机器人框架**，允许管理员通过私聊机器人执行广播命令。  
支持以下功能：

- 向指定群发送图文消息  
- 向机器人所在的全部群聊进行全局广播  
- 支持文本、图片、图文混合发送  
- 内置限速机制，防止触发平台风控  

---

## 插件配置项说明
> 以下配置项说明将同时体现在 `.ts` 源码注释中。

| 配置项 | 类型 | 默认值 | 说明 |
|:------|:------|:------|:------|
| （无配置项） | - | - | 本插件暂不需要用户配置。 |

---

## 使用指令

  ```
  /broadcast -l [群号] -t [文本] -p [图片URL]
  ```

| 参数 | 说明 |
|:------|:------|
| `-l` | 指定群号（不使用时请配合 `-o` 全局广播） |
| `-t` | 要发送的文本 |
| `-p` | 图片 URL（可与文本同发） |
| `-o` | 启用全局广播模式 |

**示例**：

  ```
  /broadcast -l 123456 -t 你好世界
  /broadcast -l 123456 -p https://example.com/a.jpg
  /broadcast -o -t 公告 -p https://example.com/pic.png
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