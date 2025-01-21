@echo off
REM Перейти в директорию, где находится bat-файл
cd /d "%~dp0"

REM Запуск локального сервера Python в папке pre-project
start "" python -m http.server 8069 --directory "pre-project"

REM Задержка для запуска сервера
timeout /t 2 > nul

REM Открытие index.html в браузере по адресу http://localhost:8069/
start "" "http://localhost:8069/"

REM Завершение работы
exit