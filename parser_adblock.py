import time
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager

def navigate_to_url(url):
    options = Options()
    options.add_argument('start-maximized')
    options.add_extension('adblock.crx')
    options.add_experimental_option('detach', True)
    options.add_experimental_option('excludeSwitches', ['enable-logging'])

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(url)

    unwanted_url = 'https://getadblock.com/ru/installed/'
    try:
        WebDriverWait(driver, 120).until(EC.url_to_be(unwanted_url))
    except TimeoutException:
        pass

    for handle in driver.window_handles:
        if handle != driver.current_window_handle:
            driver.switch_to.window(handle)
            driver.close()

    driver.switch_to.window(driver.window_handles[0])
    return driver
# Переход на страницу
if __name__ == '__main__':
    driver = navigate_to_url('https://www.afisha.ru/msk/restaurants/restaurant_list/')