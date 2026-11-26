# Antigravity 简体中文汉化补丁

适用于 Google Antigravity 2.0+ Windows 桌面端的简体中文汉化脚本，仅依赖 Python 标准库，无需安装 Node.js 或第三方包。

---

## 功能说明

1. **界面与菜单汉化**
   - 直接解析并重打包 `resources/app.asar`，同步重新计算 SHA256 `integrity` 校验信息。
   - 覆盖主界面、设置面板、应用菜单与系统托盘菜单。
   - 前端翻译时通过 DOM 选择器跳过编辑器、代码块、终端、输入框、模型回复正文与已有会话标题，避免误替换代码或对话内容。

2. **新会话默认中文标题**
   - 新会话标题由后端 `language_server.exe` 内置英文提示词生成。脚本通过等长字节替换将该提示词改为输出 4~12 字简体中文标题，不改变可执行文件结构与大小。

3. **运行时替换与更新后自动恢复**
   - 支持在客户端运行期间执行补丁：写入前自动将原文件备份到 `backups/`，界面部分按 `Ctrl + R` 刷新生效，标题部分重启客户端后生效。
   - 提供 `--auto-heal` 检查模式：通过比对文件大小与修改时间判断是否被官方更新覆盖，若检测到更新则自动备份新版本原文件并重新写入补丁。

---

## 环境要求

- Windows 10 / 11
- Python 3.8 及以上版本

---

## 使用方法

### 1. 安装汉化
双击运行根目录下的 **`安装汉化.bat`**，或执行命令：

```powershell
python src\apply_patch.py --apply
```

如果安装时客户端正在运行，切回窗口按 `Ctrl + R` 即可刷新出中文界面；新会话中文标题需重启客户端后生效。

### 2. 开启更新后自动恢复（可选）
- **计划任务 / 登录自检**：双击运行 **`开启自动恢复.bat`**（或执行 `python src\apply_patch.py --enable-auto-heal`）。关闭可执行 `python src\apply_patch.py --disable-auto-heal`。
- **自定义启动脚本调用**：也可在启动 `Antigravity.exe` 前调用：
  ```powershell
  python "path\to\src\apply_patch.py" --auto-heal --quiet
  ```

### 3. 检查状态与还原原版
- **检查状态**：双击 **`检查状态.bat`**（或执行 `python src\apply_patch.py --status`）。
- **还原原版**：双击 **`还原原版.bat`**（或执行 `python src\apply_patch.py --restore`），从 `backups/` 恢复原版 `app.asar` 与 `language_server.exe`。

---

## 目录结构

```text
antigravity-zh-patch/
├── dicts/                      # 简体中文词库（JSON 格式，4,400+ 词条）
│   ├── common.json             # 通用界面词条
│   ├── menu_nav.json           # 导航栏与菜单词条
│   ├── page_agents.json        # 智能体面板词条
│   ├── page_mcp_knowledge.json # MCP 与知识库词条
│   ├── page_settings.json      # 设置面板词条
│   ├── page_v218_extra.json    # v2.18 补充词条
│   ├── page_v222_patch.json    # v2.22 补充词条
│   ├── page_v226_patch.json    # v2.26 补充词条
│   ├── page_v235_patch.json    # v2.35 补充词条
│   ├── page_workspaces.json    # 工作区词条
│   └── zz_custom.json          # 用户自定义覆盖词典（加载优先级最高）
├── src/
│   ├── apply_patch.py          # ASAR 重打包、二进制替换、备份还原与自动恢复脚本
│   └── preload_template.js     # 前端 DOM 翻译注入脚本
├── 安装汉化.bat
├── 开启自动恢复.bat
├── 检查状态.bat
├── 还原原版.bat
├── LICENSE
└── README.md
```

---

## 补充自定义词条

如果后续版本出现未翻译的新英文词条：
1. 打开 [`dicts/zz_custom.json`](dicts/zz_custom.json)（词典按文件名排序加载，`zz_` 开头的文件会覆盖同名旧词条）；
2. 按 `"英文原文": "中文译文"` 格式添加并保存；
3. 重新运行 `安装汉化.bat`，并在客户端内按 `Ctrl + R` 刷新。

---

## 致谢与协议

- 部分基础词条早期整理参考自开源项目 [qqxpee/antigravity2-cn](https://github.com/qqxpee/antigravity2-cn)。
- 本项目采用 [MIT License](LICENSE) 协议开源。
