import time
import requests
from bs4 import BeautifulSoup
from lxml import html
from selenium import webdriver
from selenium.webdriver.common.by import By

#task2 https://www.pomorie.ru/news/




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

    button = driver.find_element(By.CSS_SELECTOR, 'div.row.more.btn.blue')
    button.click()
    taps += 1
    # Ожидание загрузки контента
    time.sleep(0.5)  # Увеличьте время, если контент загружается медленно

    # Проверка новой высоты страницы
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height or taps == 5:
        break
    last_height = new_height


html_code = driver.page_source
driver.quit()
soup = BeautifulSoup(html_code, 'html.parser')
news = soup.find_all('a', class_="info")
for new in news:
    print(new.text, "\n\n")