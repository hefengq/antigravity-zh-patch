@echo off
chcp 65001 >nul
title Antigravity 汉化安装
echo 正在写入 Antigravity 界面汉化与中文标题补丁...
echo.
python "%~dp0src\apply_patch.py" --apply
echo.
echo 处理完成。若 Antigravity 正在运行，在窗口内按 Ctrl+R 即可刷新界面；
echo 新会话默认中文标题需重启客户端后生效。
pause
