<!--
作者: Doom
用途: 插件说明通用文档模板
版本: 1.0.0
-->
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
> 注意：使用`-t`指令参数时请将其放于指令末端，如下示例：


  ```
  /broadcast -l [群号] -p [图片URL] -h -t [文本]
  ```

| 参数 | 说明 |
|:------|:------|
| `-o` | 启用全局广播模式 |
| `-l` | 指定群号（不使用时请配合 `-o` 全局广播） |
| `-k` | 跳过广播指定群（不使用时请配合 `-o` 全局广播） |
| `-p` | 图片 URL（可与文本同发） |
| `-h` | 指定广播合并聊天记录消息（仅Onebot） |


**示例**：

  ```
  /broadcast -l 123456,654321 -t 你好世界
  /broadcast -k 123456 -p https://example.com/YuzuSoft.jpg
  /broadcast -o -p https://example.com/SenrenBanka.png -t 公告
  /broadcast -o -h -p https://example.com/BlueArchive.png -t 公告
  ```

---

## 帮助与反馈

- 如有Bug请前往[Github项目主页](https://github.com/DoomVoss/Koishi-Plugins-CBS)提交Issue

---

<details>
<summary>点击此处 可查看更新日志</summary>

-   **1.0.0**
    -   首次上传插件

-   **1.0.1**
    -   ？你们的春竹开发者忘记在 `package.json` 里写 `license` 了
    -   在 `package.json` 中添加 `MIT license` 字段

-   **1.1.0**
    -   新增：添加`-k`指令参数，可跳过广播指定的一个或多个群聊（以英文逗号分隔）
    -   新增：添加`-h`指令参数，支持以合并转发消息形式发送图文结合广播
    -   优化：修改`-l`指令参数，现可指定广播至单个或多个群聊
    -   调整：延迟限流策略，现为每次 10 群、间隔 1000~2000ms
    -   修复：若干潜在 Bug，优化代码整体逻辑与稳定性
    -   TODO：在插件配置项中添加更多自定义配置（欢迎提Issue）

</details>  