import time
import requests
from bs4 import BeautifulSoup
from lxml import html
from selenium import webdriver
from selenium.webdriver.common.by import By

#task2 https://extraguide.ru/russia/moscow/sights/

# Инициализация веб-драйвера
driver = webdriver.Chrome()

# Переход на страницу
driver.get('https://extraguide.ru/russia/moscow/sights/')
last_height = driver.execute_script("return document.body.scrollHeight")

# Имитация прокрутки вниз (можно изменить в зависимости от сайта)
taps = 0
while True:
    # Прокрутка вниз
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    # button = driver.find_element(By.CSS_SELECTOR, 'div.row.more.btn.blue')
    # button.click()
    # taps += 1
    # Ожидание загрузки контента
    time.sleep(1)  # Увеличьте время, если контент загружается медленно

    # Проверка новой высоты страницы
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height or taps == 5:
        break
    last_height = new_height


html_code = driver.page_source
driver.quit()
soup = BeautifulSoup(html_code, 'html.parser')
names = soup.find_all('h2')
for new in names:
    print(new.text, "\n\n")

rates = soup.find_all('span', class_='sight-score__value')
for rate in rates:
    print(rate.text, "\n\n")

cords = soup.find_all('a', class_='adrlink [ js-sight-popup-map ]')
for cord in cords:
    print(cord.text, "\n\n")

sites = soup.find_all('a', class_='sitelink')
for site in sites:
    print(site.text, "\n\n")

bullets = soup.find_all('a', class_='sightvcatex')
for bullet in bullets:
    print(bullet.text, '\n\n')
