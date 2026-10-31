# 反重力中文汉化补丁 (Antigravity 2.0 Chinese Localization & Auto-Title Patch)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078d7.svg)]()
[![Antigravity](https://img.shields.io/badge/Antigravity-2.0%2B-10b981.svg)]()

专为 **Google Antigravity 2.0+** 桌面端打造的**纯 Python 零依赖中文汉化补丁**。  
实现全界面、系统菜单、托盘与设置面板的中文化，还解决了「新对话标题总是变成英文」的问题，并支持官方更新后自动恢复、永不失效。

---

## ✨ 核心特性

1. **🎯 新对话默认简体中文命名**
   - **根因解决**：Antigravity 新对话标题由后端 `language_server.exe` 独立请求生成，内部硬编码了 `Respond with ONLY a short conversation title (3-5 words, title-cased, no prefix)`，导致即使在 `GEMINI.md` 写了中文规则，侧边栏标题依然频繁变成英文。
   - **原生修复**：通过 522 字节等长二进制替换，将内置标题生成 Prompt 改为强制输出 **4~12 字简体中文标题**，不破坏 PE 结构，从源头直接生成中文会话名。

2. **⚡ 纯 Python 原生 ASAR 封包（0.5 秒极速完成，零 Node.js / `npx` 依赖）**
   - 无需安装 Node.js 或联网调用 `npx @electron/asar`，纯 Python 标准库直接解析并重打包 `app.asar`。
   - **严格重算 SHA256 `integrity` 校验块**，完全符合官方 Electron ASAR 规范。

3. **🛡️ 容器级防误伤物理隔离（绝不污染代码与聊天记录）**
   - 向上回溯 DOM 容器白名单，严格跳过 `<pre>`、`<code>`、`.monaco-editor`、`.cm-editor`、`.terminal`、`.xterm`、用户输入区、AI 回复正文、思考过程以及左侧已有会话标题。
   - 已剔除第三方开源脚本中的调试抓取代码与冗余 DLL 注入逻辑，纯净安全。

4. **🔄 运行时无感热替换 & 官方更新自动自愈**
   - **免杀进程热替换**：利用 Windows NTFS 底层重命名特性，即使 Antigravity 正在运行也能安全打入补丁，无需强杀进程中断当前对话（打完补丁按 `Ctrl + R` 即可刷新出中文界面）。
   - **毫秒级更新自愈**：支持 `--auto-heal` 模式（通过 `patch_state.json` 比对文件大小与修改时间戳，未更新时耗时 `< 5ms`；检测到官方升级覆盖文件后自动备份新版原文件并在 0.5 秒内重新注入）。

---

## 🚀 快速开始

### 环境要求
- Windows 10 / 11
- Python 3.8+（仅使用标准库，无需 `pip install` 任何第三方包）

### 1. 一键安装汉化与中文标题补丁
双击运行仓库根目录下的：
- **`一键安装汉化.bat`**（或执行 `python src\apply_patch.py --apply`）

> 💡 **提示**：如果安装时 Antigravity 正在运行，直接切回软件窗口按快捷键 **`Ctrl + R`** 即可立即看到中文界面；「新对话默认中文命名」将在下次重启客户端时生效。

### 2. 开启「更新不失效」自动自愈
- **方式 A（通用计划任务守护）**：双击运行 **`开启更新自动自愈.bat`**（或执行 `python src\apply_patch.py --enable-auto-heal`）。
- **方式 B（挂载到自定义启动器 / PowerShell 启动脚本）**：在启动 `Antigravity.exe` 前加一行：
  ```powershell
  python "path\to\src\apply_patch.py" --auto-heal --quiet
  ```

### 3. 状态检查与一键无损还原
- **检查状态**：双击 **`检查汉化状态.bat`**（或执行 `python src\apply_patch.py --status`）
- **还原英文原版**：双击 **`一键还原官方原版.bat`**（或执行 `python src\apply_patch.py --restore`），脚本会自动从 `backups\` 恢复官方纯净原版 `app.asar` 与 `language_server.exe`。

---

## 📂 项目结构

```text
antigravity-zh-patch/
├── dicts/                      # 分类简体中文词库 (JSON 格式，2,830+ 词条)
│   ├── common.json             # 通用 UI 词条
│   ├── menu_nav.json           # 导航栏与菜单词条
│   ├── page_agents.json        # 智能体面板词条
│   ├── page_mcp_knowledge.json # MCP 与知识库词条
│   ├── page_settings.json      # 设置面板词条
│   ├── page_v218_extra.json    # 扩展界面词条
│   ├── page_v222_patch.json    # 新版增量词条
│   ├── page_workspaces.json    # 工作区词条
│   └── zz_custom.json          # 用户自定义/新版增量覆盖词典 (最高优先级)
├── src/
│   ├── apply_patch.py          # 核心封包、二进制补丁与自愈引擎
│   └── preload_template.js     # 前端 DOM 容器隔离翻译注入运行时
├── 一键安装汉化.bat
├── 开启更新自动自愈.bat
├── 检查汉化状态.bat
├── 一键还原官方原版.bat
├── LICENSE
└── README.md
```

---

## 🛠️ 自定义与补充词条

如果后续 Antigravity 更新后出现了个别未翻译的新英文句子：
1. 打开 [`dicts/zz_custom.json`](dicts/zz_custom.json)（由于文件名以 `zz_` 开头，它的加载优先级最高，会覆盖同名旧词条）；
2. 按 `"英文原句": "中文翻译"` 的格式添加词条并保存；
3. 双击运行 `一键安装汉化.bat`，然后在软件内按 `Ctrl + R` 刷新即可生效。

---

## 🙏 致谢与开源协议

- 基础界面分类词库部分参考并整理自开源项目 [qqxpee/antigravity2-cn](https://github.com/qqxpee/antigravity2-cn)，特此致谢。
- 本项目采用 [MIT License](LICENSE) 开源协议，仅供个人学习与技术交流使用。
