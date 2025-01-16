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
    print("WAITED BEFORE CLICK!")
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
    time.sleep(3)  # Увеличьте время, если контент загружается медленно
    print("WAITED!")
    # Проверка новой высоты страницы
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height or taps == 1:
        break
    #last_height = new_height


html_code = driver.page_source
driver.quit()
soup = BeautifulSoup(html_code, 'html.parser')
file = open('data2.txt', 'w', encoding='utf-8')

matches = soup.find_all('div', class_='CardTwoBlock_card__GFR2L Template_card__ZnZUD Listing_card__hNL_B')
print("MATCHES\n\n")
for matche in matches:
    match = (f'<html>\n<body>\n{matche}\n<body>\n<html>')
    soup = BeautifulSoup(match, 'html.parser')
    name = soup.find('span', class_='Text_text__e9ILn Template_title__3vIhm')
    try:
        file.write(f'{name.text}\n')
    except:
        file.write(f'{'None'}\n')

    kitchen = soup.find('span', class_='Text_text__e9ILn TypeAndPrice_type-url__5phPv')
    try:
        file.write(f'{kitchen.text}\n')
    except:
        file.write(f'{'None'}\n')

    time = soup.find('p', class_='Text_text__e9ILn ScheduleAndPrice_schedule__Rv03e')
    try:
        file.write(f'{time.text}\n')
    except:
        file.write(f'{'None'}\n')

    rate = soup.find('span', class_='Rating_rating__NLDVH')
    try:
        file.write(f'{rate.text}\n')
    except:
        file.write(f'{'None'}\n')

    price = soup.find('span', {
        'class': 'PriceRange_price-range-wrap__bRS6r PriceRange_price-range-wrap--black__Z95uY PriceRange_link__UrWzf undefined'})
    html = (f'<html>\n<body>\n{matche}\n<body>\n<html>')
    soup = BeautifulSoup(html, 'html.parser')
    active_prices = soup.find_all('span', {'data-active': 'true'})
    count = 0
    for price in active_prices:
        count += 1

    if count == 1:
        try:
            file.write(f'700\n')
        except:
            file.write(f'{'None'}\n')
    elif count == 2:
        try:
            file.write(f'700 - 1700\n')
        except:
            file.write(f'{'None'}\n')
    elif count == 3:
        try:
            file.write(f'1700 - 3000\n')
        except:
            file.write(f'{'None'}\n')
    elif count == 4:
        try:
            file.write(f'3000\n')
        except:
            file.write(f'{'None'}\n')

    metro = soup.find('div', class_='Place_metro__sSZ56')
    try:
        file.write(f'{metro.text}\n\n')
    except:
        file.write(f'{'None'}\n')
    print('\n')


