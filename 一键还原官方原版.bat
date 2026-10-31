@echo off
chcp 65001 >nul
title Antigravity 还原官方英文原版
echo ==========================================================
echo   正在还原 Antigravity 官方英文原版 (app.asar + language_server)
echo ==========================================================
python "%~dp0src\apply_patch.py" --restore
echo.
echo [完成] 已还原为官方原版文件！重启或按 Ctrl+R 刷新即可恢复英文。
pause
