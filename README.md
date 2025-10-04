# 🎮 RPGMaker-EGP-Plugin

本仓库（RPGMaker-EGP-Plugin）收录作者 EricG 为 RPG Maker 系列开发的插件，包含对 RPG Maker MV（RMMV）与 RPG Maker MZ（RMMZ）两种引擎的插件实现。

This repository (RPGMaker-EGP-Plugin) contains plugins for both RPG Maker MV and RPG Maker MZ by EricG.

---

## 📦 本仓库包含的插件 / Included plugins

目前仓库中包含的主要插件：

- RPG Maker MV: `RMMV-Plugin/EGP_DateTimeSystem.js` — 日期/时间系统，支持显示、跳转与持久化保存。
- RPG Maker MZ: `RMMZ-Plugin/EGPMZ_DateTimeSystem.js` — 为 MZ 适配的同类日期/时间系统插件（接口与行为可能与 MV 版有所不同）。

后续会在仓库中继续添加更多插件与文档。

---

## � 快速使用指南 / Quick start

1. 选择对应引擎的插件文件并复制到你的项目插件目录：
	- 对于 MV：将 `RMMV-Plugin/EGP_DateTimeSystem.js` 复制到 RPG Maker MV 项目的 `js/plugins/` 下。
	- 对于 MZ：将 `RMMZ-Plugin/EGPMZ_DateTimeSystem.js` 复制到 RPG Maker MZ 项目的 `js/plugins/` 下。
2. 打开 RPG Maker 的插件管理器（Plugin Manager），添加并启用对应插件。
3. 在插件参数中按需配置（插件头部注释中通常有参数说明）。

更多使用示例请查看各插件文件头部的注释说明。

---

## 📁 仓库结构 / Repository layout

简要说明当前仓库的文件结构：

```
RPGMaker-EGP-Plugin/
├─ LICENSE
├─ README.md
├─ RMMV-Plugin/
│  └─ EGP_DateTimeSystem.js      # MV 版插件
└─ RMMZ-Plugin/
	└─ EGPMZ_DateTimeSystem.js    # MZ 版插件
```

---

## 📄 许可 / License

本仓库采用 MIT 许可证（见 `LICENSE` 文件）。使用或修改本仓库代码时，请保留原始许可声明。

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 📬 反馈与贡献 / Feedback & Contribution

欢迎提交 Issue 报告 bug 或提出功能建议，也欢迎通过 Pull Request 来贡献代码或文档修正。请在贡献前阅读代码与插件头部注释以了解设计决策。

- Issues: https://github.com/ericgao96uw/RPGMaker-EGP-Plugin/issues
- Pull requests: https://github.com/ericgao96uw/RPGMaker-EGP-Plugin/pulls

感谢你的关注与支持！

---

作者 / Author: EricG

最后更新: 2025-10-04
