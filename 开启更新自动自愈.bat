@echo off
chcp 65001 >nul
title Antigravity 开启更新自动自愈
echo ==========================================================
echo   正在配置 Antigravity 官方更新后自动重打汉化与中文标题补丁
echo ==========================================================
python "%~dp0src\apply_patch.py" --enable-auto-heal
echo.
echo [完成] 已开启更新自动自愈守护！
pause
