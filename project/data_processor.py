import pandas as pd
import json

# Загрузка данных
places_df = pd.read_csv("C:/Users/pisma/Desktop/TOUR_DB/moscow_attractions_updated.csv", sep=';')
restaurants_df = pd.read_csv("C:/Users/pisma/Desktop/TOUR_DB/dataset2.csv")
hotels_df = pd.read_csv("C:/Users/pisma/Desktop/TOUR_DB/dataset_hotel.csv")

# # Выбор важных столбцов
places_data = places_df[['Name', 'Rate', 'Price', 'Coordinates']].to_dict(orient='records')
restaurants_data = restaurants_df[['Name', 'Kitchen', 'Time', 'Rate', 'Price']].to_dict(orient='records')
hotels_data = hotels_df[['Name', 'Rate', 'active_price', 'address', 'metro']].to_dict(orient='records')

# Объединение данных в JSON
output_data = {
    "tourist_places": places_data,
    "restaurants": restaurants_data,
    "hotels": hotels_data
}

# Сохранение в JSON-файл
with open("moscow_tourism_data.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=4, ensure_ascii=False)