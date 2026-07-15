<div align="center">
  <h1>调色板插件 - ToolBox</h1>
  <p><em>ToolBox 的颜色选择、多格式转换与配色方案生成工具。</em></p>

  [![ToolBox 生态](https://img.shields.io/badge/ToolBox-生态-f59e0b?style=for-the-badge&logo=electron&logoColor=white)](https://github.com/fqyjfb/toolbox)
  [![许可证](https://img.shields.io/badge/许可证-MIT-green?style=for-the-badge)](LICENSE)
</div>

---

ToolBox 是一个多功能平台，旨在托管丰富的插件生态系统，将强大的工具无缝集成到您的日常工作中。作为该生态系统的扩展，**调色板插件**为设计师和开发者提供了专业的颜色选取与配色方案生成能力。

## 什么是调色板插件？

调色板插件是 ToolBox 的一个颜色工具，提供直观的颜色选择界面，支持 HEX、RGB、HSL、HSV 多种颜色格式转换，并内置 25 种智能配色方案生成器，帮助您快速构建和谐的色彩组合。

## 主要功能

- **多格式颜色转换：** 实时显示 HEX、RGB、HSL、HSV 四种颜色格式，一键复制到剪贴板。
- **颜色选择器：** 支持原生颜色选择器和手动输入 HEX 值，带粘贴功能。
- **智能配色方案：** 内置 25 种配色方案生成器，包括：
  - 渐变类：通用渐变、匹配渐变、跳跃渐变等
  - 调色板类：点缀调色板、优雅调色板、立方体调色板等
  - 互补色类：切换调色板、图钉调色板、高亮调色板等
  - 特殊类：灰色伙伴、尘埃调色板、随机色调等
- **基础颜色：** 10 种常用基础颜色快速选取。
- **流行配色：** 6 套精心设计的行业配色方案（科技蓝、自然绿、温暖橙等）。
- **暗色模式：** 完整支持亮色/暗色主题切换。

## 配置与使用

1. **安装：** 从 ToolBox 插件商店安装 `调色板` 插件。
2. **选择颜色：** 通过颜色选择器或手动输入 HEX 值选取颜色。
3. **复制颜色：** 点击任意颜色格式旁的复制按钮，或点击配色卡片复制颜色值。
4. **生成方案：** 在左侧配色方案列表中切换不同的生成器，右侧实时展示基于当前颜色的配色结果。
5. **应用配色：** 点击基础颜色或流行配色快速切换主色。

---

## 插件开发

本插件遵循 ToolBox 插件开发规范。更多详情请参阅：
- [PLUGIN_DEVELOPMENT_SPEC.md](https://github.com/fqyjfb/toolbox/blob/main/docs/PLUGIN_DEVELOPMENT_SPEC.md)
- [PLUGIN_DEVELOPMENT_GUIDE.md](https://github.com/fqyjfb/toolbox/blob/main/docs/PLUGIN_DEVELOPMENT_GUIDE.md)

---

## 许可证

MIT
