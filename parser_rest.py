import csv
import time
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException

# Инициализация веб-драйвера
driver = webdriver.Chrome()
driver.maximize_window()

# Переход на страницу
driver.get('https://101hotels.com/main/cities/moskva?viewType=tiles&page=1')

# Создание CSV файла
with open('dataset_hotel.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)

    # Запись заголовков столбцов
    writer.writerow(['Name', 'Rate', 'active_price', 'address', 'metro'])

    taps = 0
    while True:
        # Имитация прокрутки вниз
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)  # Ожидание загрузки контента

        # Получение HTML текущей страницы
        html_code = driver.page_source
        soup = BeautifulSoup(html_code, 'html.parser')

        # Поиск всех карточек на текущей странице
        matches = soup.find_all('li', class_='item')
        for match in matches:
            soup = BeautifulSoup(str(match), 'html.parser')

            # Название заведения
            name = soup.find('a', class_='has_query_params')
            name_text = name.get_text(strip=True) if name else None

            # Рейтинг
            rate = soup.find('span', class_='d-block rating-value')
            rate_text = rate.get_text(strip=True) if rate else None

            # Цена
            active_prices = soup.find('span', class_='price-highlight')
            active_prices_text = active_prices.get_text(strip=True) if active_prices else None

            # Адрес
            address = soup.find('span', class_='item-address')
            address_text = address.get_text(strip=True) if address else None

            # Метро
            blocks = soup.find_all('div', class_='distance-to')
            metro_text = None
            for block in blocks:
                if block.find('span', class_='icon-metro'):  # Проверяем, что внутри есть элемент с 'icon-metro'
                    metro = block.find('span', class_='distance tooltip')
                    if metro:
                        metro_text = ' '.join(metro.get_text(strip=True).split(' ')[:-1])
                    break

            # Если метро не найдено, установить значение None
            if not metro_text:
                metro_text = None

            # Запись строки данных
            writer.writerow([name_text, rate_text, active_prices_text, address_text, metro_text])

        print(f"Page {taps + 1} scraped successfully.")

        # Переход на следующую страницу
        try:
            next_button = driver.find_element(By.CLASS_NAME, 'page-link.next')
            next_button.click()
            taps += 1
            time.sleep(3)  # Задержка для загрузки следующей страницы
        except NoSuchElementException:
            print("Последняя страница достигнута.")
            break

# Завершение работы с драйвером
driver.quit()
