@echo off
chcp 65001 >nul
title Antigravity 开启自动恢复
echo 正在配置客户端更新后自动重打汉化补丁...
echo.
python "%~dp0src\apply_patch.py" --enable-auto-heal
echo.
echo 配置完成。
pause
