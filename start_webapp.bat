@echo off
REM Перейти в директорию, где находится bat-файл
cd /d "%~dp0"

REM Запуск локального сервера Python в папке project
start "" python -m http.server --directory "project"

REM Задержка для запуска сервера
timeout /t 2 > nul

REM Открытие index.html в браузере по адресу http://localhost:8000/
start "" "http://localhost:8000/"

REM Завершение работы
exit
