@echo off
REM Перейти в директорию, где находится bat-файл
cd /d "%~dp0"

REM Запуск локального сервера Python в папке testapp
start "" python -m http.server 8024 --directory "testapp"

REM Задержка для запуска сервера
timeout /t 2 > nul

REM Открытие index.html в браузере по адресу http://localhost:8024/
start "" "http://localhost:8024/"

REM Завершение работы
exit