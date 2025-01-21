@echo off
REM Перейти в директорию, где находится bat-файл
cd /d "%~dp0"

REM Перейти в папку проекта
cd project

REM Запуск сервера Node.js (server.js)
start "" node server.js

REM Задержка для запуска сервера
timeout /t 2 > nul

REM Открытие сайта в браузере по адресу http://localhost:3000/
start "" "http://localhost:3000/"

REM Завершение работы
exit
