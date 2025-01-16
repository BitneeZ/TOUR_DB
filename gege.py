import csv
import time
import requests
from bs4 import BeautifulSoup
from lxml import html
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import re

#task2 https://www.afisha.ru/msk/restaurants/restaurant_list/

# Инициализация веб-драйвера
driver = webdriver.Chrome()
driver.maximize_window()

# Переход на страницу
driver.get('https://www.afisha.ru/msk/restaurants/restaurant_list/')
last_height = driver.execute_script("return document.body.scrollHeight")

# Имитация прокрутки вниз (можно изменить в зависимости от сайта)
taps = 0
while True:
    # Прокрутка вниз
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    try:
        button = driver.find_element(By.CLASS_NAME, 'popmechanic-close')
        button.click()
        print('ADD WAS CLOSED!')
    except:
        button = driver.find_element(By.CLASS_NAME, 'ButtonLoadMore_show-more-button__FXKXn')
        button.click()
        taps += 1
        print("CLICKED!")
    # Ожидание загрузки контента
    time.sleep(4)  # Увеличьте время, если контент загружается медленно
    print("WAITED!")
    # Проверка новой высоты страницы
    new_height = driver.execute_script("return document.body.scrollHeight")
    print(taps)
    if new_height == last_height or taps == 150:
        break
    #last_height = new_height


html_code = driver.page_source
driver.quit()
soup = BeautifulSoup(html_code, 'html.parser')
file = open('data2.txt', 'w', encoding='utf-8')


matches = soup.find_all('div', class_='CardTwoBlock_card__GFR2L Template_card__ZnZUD Listing_card__hNL_B')

# Создание CSV файла
with open('dataset.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)

    # Запись заголовков столбцов
    writer.writerow(['Name', 'Kitchen', 'Time', 'Rate', 'Price', 'Metro'])

    matches = soup.find_all('div', class_='CardTwoBlock_card__GFR2L Template_card__ZnZUD Listing_card__hNL_B')
    print("MATCHES\n\n")
    for matche in matches:
        match = (f'<html>\n<body>\n{matche}\n<body>\n<html>')
        soup = BeautifulSoup(match, 'html.parser')

        # Название заведения
        name = soup.find('span', class_='Text_text__e9ILn Template_title__3vIhm')
        name_text = name.get_text(strip=True) if name else None

        # Кухня
        kitchen = soup.find('span', class_='Text_text__e9ILn TypeAndPrice_type-url__5phPv')
        kitchen_text = kitchen.get_text(strip=True) if kitchen else None

        # Время работы
        time = soup.find('p', class_='Text_text__e9ILn ScheduleAndPrice_schedule__Rv03e')
        time_text = time.get_text(strip=True) if time else None

        # Рейтинг
        rate = soup.find('span', class_='Rating_rating__NLDVH')
        rate_text = rate.get_text(strip=True) if rate else None

        # Цена
        active_prices = soup.find_all('span', {'data-active': 'true'})
        count = len(active_prices)
        if count == 1:
            price = '700'
        elif count == 2:
            price = '700 - 1700'
        elif count == 3:
            price = '1700 - 3000'
        elif count == 4:
            price = '3000'
        else:
            price = ''

        # Метро
        metro = soup.find('div', class_='Place_metro__sSZ56')
        metro_text = ";".join([item.get_text(strip=True) for item in metro.find_all('span')]) if metro else None

        # Запись строки данных
        writer.writerow([name_text, kitchen_text, time_text, rate_text, price, metro_text])