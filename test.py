# Location: Десятисимвольная случайная строка, представляющая собой название локации.
# Nation: Выборочно выбирается из списка наций.
# Type: Выборочно выбирается из ряда категорий, связанных с путешествиями.
# Visitor count: Случайное целочисленное значение, указывающее, сколько человек посетило сайт.
# Rating: Случайное плавающее число в диапазоне от 1,0 до 5,0, используемое для указания рейтинга.
# Revenue: Случайно выбранное плавающее значение, указывающее на полученный доход.
# Accommodation_Available: Возвращает значение «Да» или «Нет» в зависимости от наличия мест для проживания.

# TOURISM = pd.read_csv("tourism_dataset.csv")
# TOURISM.info()
# print(TOURISM)


# Название места
# Координаты места
# Рейтинг достопримичательнсти
# 

import pandas as pd
import json

# Функция для преобразования CSV в JSON для дашборда
def convert_csv_to_json(csv_file_path, json_output_path, num_rows=10):
    """
    Преобразует первые `num_rows` строк из CSV в JSON, подходящий для дашборда.

    :param csv_file_path: Путь к входному CSV-файлу.
    :param json_output_path: Путь для сохранения JSON-файла.
    :param num_rows: Количество строк для выборки (по умолчанию 10).
    """
    try:
        # Загрузка CSV
        data = pd.read_csv(csv_file_path)

        # Проверка наличия необходимых столбцов
        required_columns = ['Location', 'Country', 'Category', 'Visitors', 'Rating', 'Revenue']
        if not all(col in data.columns for col in required_columns):
            raise ValueError(f"CSV должен содержать столбцы: {', '.join(required_columns)}")

        # Выбираем первые `num_rows` строк
        sample_data = data[required_columns].head(num_rows)

        # Преобразуем значения в числовой формат
        sample_data['Visitors'] = pd.to_numeric(sample_data['Visitors'], errors='coerce')
        sample_data['Revenue'] = pd.to_numeric(sample_data['Revenue'], errors='coerce')
        sample_data['Rating'] = pd.to_numeric(sample_data['Rating'], errors='coerce')

        # Удаляем строки с отсутствующими значениями
        sample_data = sample_data.dropna()

        # Вычисляем статистику
        statistics = {
            "total_records": len(sample_data),
            "mean_visitors": round(sample_data['Visitors'].mean(), 2),
            "mean_rating": round(sample_data['Rating'].mean(), 2),
            "mean_revenue": round(sample_data['Revenue'].mean(), 2),
            "max_visitors": int(sample_data['Visitors'].max()),
            "min_visitors": int(sample_data['Visitors'].min()),
            "max_revenue": round(sample_data['Revenue'].max(), 2),
            "min_revenue": round(sample_data['Revenue'].min(), 2),
        }

        # Подготовка данных для JSON
        output_data = {
            "labels": sample_data['Location'].tolist(),
            "values": sample_data['Visitors'].tolist(),
            "categories": sample_data['Category'].tolist(),
            "statistics": statistics
        }

        # Сохранение в JSON
        with open(json_output_path, 'w', encoding='utf-8') as json_file:
            json.dump(output_data, json_file, indent=4, ensure_ascii=False)

        print(f"Данные успешно сохранены в {json_output_path}")

    except Exception as e:
        print(f"Ошибка: {e}")

# Пути к файлам
csv_file_path = 'C:/Users/pisma/Desktop/TOUR_DB/tourism_dataset.csv'  # Замените на ваш путь к CSV
json_output_path = 'C:/Users/pisma/Desktop/TOUR_DB/tourism_dashboard.json'  # Путь для сохранения JSON

# Запуск функции с выборкой первых 10 строк
convert_csv_to_json(csv_file_path, json_output_path, num_rows=10)