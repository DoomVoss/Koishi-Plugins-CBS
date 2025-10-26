<!--
作者: Doom
用途: 插件说明通用文档模板
版本: 1.0.0
-->
# koishi-plugin-group-counter

[![npm](https://img.shields.io/npm/v/koishi-plugin-group-counter?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-group-counter)

## 插件介绍
本插件用于 **Koishi 机器人框架**，查询机器人所在群及人数，可自定义查询范围。 

- 内置限速机制，防止触发平台风控  

---

## 插件配置项说明
> 以下配置项说明将同时体现在源码注释中。

| 配置项 | 类型 | 默认值 | 说明 |
|:------|:------|:------|:------|
| （无配置项） | - | - | 本插件暂不需要用户配置。 |

---

## 使用指令

  ```
  群人数 [maxCount:number]
  ```

| 参数 | 说明 |
|:------|:------|
| `maxCount:number` | 传入该参数时只返回人数小于等于该值的群聊，留空则返回全部 |

---

## 帮助与反馈

- 如有Bug请前往[Github项目主页](https://github.com/DoomVoss/Koishi-Plugins-CBS)提交Issue

---

<details>
<summary>点击此处 可查看更新日志</summary>

-   **1.0.0**
    -   首次上传插件

</details>  