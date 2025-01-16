import re

# Исходный HTML-код
html = '''
/sightmap/?z=14&pt=55.767011, 37.614226&t=Московский музей современного искусства&a=ул. Петровка, 25 

'''

# Регулярное выражение для поиска координат между pt= и &
pattern = r'pt=([\d\.\-]+),\s*([\d\.\-]+)'

# Поиск координат
match = re.search(pattern, html)

if match:
    latitude = match.group(1)
    longitude = match.group(2)
    print(f"Широта: {latitude}, Долгота: {longitude}")
else:
    print("Координаты не найдены.")