@echo off
chcp 65001 >nul
title Antigravity 汉化状态检查
python "%~dp0src\apply_patch.py" --status
echo.
pause
