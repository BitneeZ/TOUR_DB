import pandas as pd

# Загрузка файла
file_path = 'moscow_attractions_updated.csv'
data = pd.read_csv(file_path)

# Замена запятой на точку в рейтинге
if 'Рейтинг' in data.columns:
    data['Рейтинг'] = data['Рейтинг'].astype(str).str.replace(',', '.')

# Сохранение обновленного файла
updated_file_path = 'moscow_attractions_rating_corrected.csv'
data.to_csv(updated_file_path, index=False)