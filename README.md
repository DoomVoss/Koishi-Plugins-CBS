<div align="center">

![Koishi-Plugins-CBS](https://socialify.git.ci/DoomVoss/Koishi-Plugins-CBS/image?description=1&descriptionEditable=A%20Koishi%20plugin%20repository%20of%20Doom%20at%20CatBotStudio&forks=1&issues=1&logo=https%3A%2F%2Fraw.githubusercontent.com%2FDoomVoss%2FKoishi-Plugins-CBS%2Fmain%2Fassets%2Ficon.png&name=1&pattern=Diagonal%20Stripes&pulls=1&stargazers=1&theme=Auto)
[![GitHubstars](https://img.shields.io/github/stars/DoomVoss/Koishi-Plugins-CBS?style=social)](https://github.com/DoomVoss/Koishi-Plugins-CBS/stargazers)
[![GitHublicense](https://img.shields.io/github/license/DoomVoss/Koishi-Plugins-CBS)](https://github.com/DoomVoss/Koishi-Plugins-CBS/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/DoomVoss/Koishi-Plugins-CBS)](https://github.com/DoomVoss/Koishi-Plugins-CBS/issues)
[![NPM](https://img.shields.io/badge/NPM-Doom-blue)](https://www.npmjs.com/~doomvoss)
[![QQ](https://img.shields.io/badge/QQ-Doom-blue)](https://qm.qq.com/q/oGwB5mKQtq)
![visitor](https://visitor-badge.laobi.icu/badge?page_id=DoomVoss.Koishi-Plugins-CBS)

</div>

# Koishi-Plugins-CBS

## 项目简介

Koishi-Plugins-CBS 是 Doom 在 **CatBotStudio** 开发的一系列 Koishi 插件集合，包括但不限于：
- Q群管理自动化（退群、消息处理、权限管理等）
- 日常交互增强（自定义回复、命令扩展、事件监听等）
- 插件兼容 Koishi v4 系列，易于安装和配置

本项目中，部分插件直接使用 JavaScript 编写，而非 TypeScript 编译。同时，也有部分插件使用 TypeScript 开发。

两者都支持 HMR 热重载，但在进行二次开发时，请根据插件的编写语言进行区分。
<img src="https://raw.githubusercontent.com/MikeCodesDotNET/ColoredBadges/master/svg/dev/languages/js.svg" alt="js" style="max-width: 50%;">

---

## QQ野生机器人应用实例

本项目组提供 QQ 野生机器人应用实例，用户可以通过该机器人直接体验本仓库中所有插件的功能。  

**体验方式：**

- 点击链接加入以下项目组机器人QQ群（任选其一即可，不限制同时加入多群）

> [猫猫_Bot交流一群](https://qm.qq.com/q/dkbbRhmDbW)
> [猫猫_Bot交流二群](https://qm.qq.com/q/Y5M84awDeu)

- 支持功能：群管理自动化、消息回复增强、命令扩展等本项目所有插件功能  
- 注意事项：请勿发送违规或破坏性指令，以免影响机器人正常运行

---

## 温馨提示

- 由于插件列表会持续更新，此处不列出所有插件说明文档，插件将陆续上传至该仓库及 npm。
- 例如，`dispose-group` 插件的说明文档位于： [plugins/dispose-group/readme.md](plugins/dispose-group/readme.md)
- 如果发现仓库代码与 npm 版本不一致，请以 npm 平台发布的版本为准。
- 发现 Bug 或有任何问题？ 欢迎[提交 Issue](https://github.com/DoomVoss/Koishi-Plugins-CBS/issues/new/choose)！
- 如果你发现本项目的 commit 长时间未更新，这意味着作者暂停了本项目的更新，并且不再维护。请自行判断项目的使用情况。

---

## 使用说明

- 该仓库内所有插件均同时发布于 npm ，可在 Koishi 插件市场内搜索到，直接安装使用即可。

---

## 开发者贡献指南

### 如何在项目模板中开发此仓库

1.  **创建项目模板**

    ```shell
    yarn create koishi
    ```

    回车确认，直到弹出 Koishi 的 WebUI。
    
    完成后在项目根目录执行 yarn 安装依赖。

2.  **进入项目模板根目录** 

    先在 Koishi 终端按下 `Ctrl + C` 退出项目模板，然后 `cd` 进入目录：

    ```shell
    cd koishi-app
    ```

3.  **克隆本仓库** 

    ```shell
    git clone https://github.com/DoomVoss/Koishi-Plugins-CBS.git
    ```

4.  **以开发模式启动** 
    
    ```shell
    yarn dev
    ```

5. 在本地开发插件或改进现有插件后，提交 [Pull Request](https://github.com/DoomVoss/Koishi-Plugins-CBS/pulls)，并确保代码风格与现有插件一致


### 发布 npm 包

本项目的贡献者可以在 `.publish/npmpublish` 目录下放置需要发布的 npm 包。

发布时，请确保将所有相关文件放在该目录中，确保目录结构如下:

**目录结构**

```shell
publish/
├── npmpublish/
│   ├── lib
│   ├── LICENSE.txt # 如存在则无需上传
│   ├── package.json
│   ├── readme.md
│   └── ...  # 其他需要发布的文件
└── npmpublish_temp/
    └── LICENSE.txt # 请勿改动
```

**注意**：在发布前请确保 `package.json` 的 `name` 字段不与已有 npm 包冲突，否则会触发 403 错误。

在 `npmpublish` 目录下，确保包含 `package.json` 和其他相关文件，以便顺利发布 npm 包。

具体实现效果 [请参见 .github 文件](.github/workflows/publish.yml)

---

## 联系

通过以下方式联系我们：

<div align="center">

<img src="assets/Groups.png" alt="宣发二维码" style="width: 100%; max-width: 1000px; height: auto; margin-bottom: 10px;">
<p>扫码二维码加入 官群 / 频道 </p>

</div>

---

## 赞助与鸣谢

如果你觉得本项目对你有帮助，可以通过以下方式支持我们：

<div align="center">

<img src="assets/Sponsor.png" alt="赞助二维码" style="width: 100%; max-width: 1000px; height: auto; margin-bottom: 10px;">
<p>扫码赞助，支持猫猫_Bot及 Koishi 插件的持续开发</p>
  
</div>

### 🎉 赞助鸣谢名单

<details>
<summary>点击查看部分赞助名单</summary>

| 序号 | 赞助者昵称        | 赞助金额 | 赞助方式 | 日期       | 付款方备注           |
|------|-----------------|----------|----------|------------|--------------------|
| 1    | 👁奸丁真          | ¥1.00    | 微信支付 | 2025-07-12 | 无                 |
| 2    | 炸膛先生          | ¥0.44    | 微信支付 | 2025-07-12 | 无                 |
| 3    | 游戏低手          | ¥40.00   | 微信支付 | 2025-07-13 | 无                 |
| 4    | M.K.紀賀元～      | ¥5.00    | 微信支付 | 2025-07-13 | 可以🌿猫吗？       |
| 5    | 名侦探柯比        | ¥11.45   | 支付宝   | 2025-07-13 | 草草Neko           |
| 6    | 匿名赞助者1        | ¥30.00   | 微信支付 | 2025-07-14 | 无                 |
| 7    | 👁奸丁真          | ¥2.04    | 微信支付 | 2025-07-14 | 无                 |
| 8    | 肘进科穴          | ¥5.00    | 支付宝   | 2025-07-15 | 期待草帽           |
| 9    | 匿名赞助者2        | ¥30.00   | 支付宝   | 2025-07-18 | 114514191          |
| 10   | 匿名赞助者3        | ¥0.01    | 微信支付 | 2025-07-18 | 无                 |

</details>

- 查看更多完整名单请点击 [SPONSORS.md](./SPONSORS.md)

---

## 许可协议

- 本项目采用 MIT 许可证，详情请参见 [LICENSE](./LICENSE) 文件

> **MIT License**
>
> Copyright (c) 2025 Doom
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> **免责声明**：
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.