@echo off
REM Перейти в директорию, где находится bat-файл
cd /d "%~dp0"

REM Запуск локального сервера Python в папке project
start "" python -m http.server 8032 --directory "project"

REM Задержка для запуска сервера
timeout /t 2 > nul

REM Открытие index.html в браузере по адресу http://localhost:8032/
start "" "http://localhost:8032/"

REM Завершение работы
exit
