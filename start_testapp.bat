@echo off
REM Перейти в директорию, где находится bat-файл
cd /d "%~dp0"

REM Запуск локального сервера Python в папке semple
start "" python -m http.server 8080 --directory "semple"

REM Задержка для запуска сервера
timeout /t 2 > nul

REM Открытие index.html в браузере по адресу http://localhost:8080/
start "" "http://localhost:8080/"

REM Завершение работы
exit