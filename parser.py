import time
import requests
from bs4 import BeautifulSoup
from lxml import html
from selenium import webdriver
from selenium.webdriver.common.by import By
import re

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

file = open('data.txt', 'w')

names = soup.find_all('h2')
print("NAEMSSSSSSSSSSSSSSSSSSSSSSSSSSS")
for name in names:
    file.write(f'{name.text}\n')

print("RATESSSSSSSSSSSSSSSSSSSSSS")
rates = soup.find_all('span', class_='sight-score__value')
for rate in rates:
    try:
        file.write(f'{rate.text}\n')
    except:
        file.write(f'{None}\n')
print("CORDSSSSSSSSSSSSSSSSSSSSSSSSS")
cords = soup.find_all('a', class_='adrlink [ js-sight-popup-map ]')
for cord in cords:
    pattern = r'pt=([\d\.\-]+),\s*([\d\.\-]+)'
    match = re.search(pattern, cord.get('href'))
    if match:
        latitude = match.group(1)
        longitude = match.group(2)
        file.write(f'{latitude}' + ',' + f'{longitude}\n')
    else:
        file.write(f'{None}\n')

print("SITESSSSSSSSSSSSSSSSSS")
sites = soup.find_all('a', class_='sitelink')
for site in sites:
    try:
        file.write(f'{site.text}\n')
    except:
        file.write(f'{'None'}\n')


print("BULETSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
bullets = soup.find_all('a', class_='sightcatexc')
for bullet in bullets:
    try:
        file.write(f'{bullet.get('href')}\n')
    except:
        file.write(f'{None}\n')
file.close()