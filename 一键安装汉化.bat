@echo off
chcp 65001 >nul
title Antigravity 汉化与中文命名一键安装
echo ==========================================================
echo   正在应用 Antigravity 2.0 界面汉化 + 新对话默认中文命名
echo ==========================================================
python "%~dp0src\apply_patch.py" --apply
echo.
echo [完成] 如 Antigravity 正在运行，请在软件内按 Ctrl+R 刷新界面即可看到中文；
echo        新对话默认中文命名将在下次启动 Antigravity 时生效。
pause
