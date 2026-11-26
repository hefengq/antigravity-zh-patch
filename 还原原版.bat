@echo off
chcp 65001 >nul
title Antigravity 还原原版
echo 正在从备份恢复原版 app.asar 与 language_server.exe...
echo.
python "%~dp0src\apply_patch.py" --restore
echo.
echo 已恢复原版文件。按 Ctrl+R 刷新或重启客户端后生效。
pause
