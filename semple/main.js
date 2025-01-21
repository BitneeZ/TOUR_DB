let currentCategory = "tourist_places";

async function fetchData() {
    const response = await fetch(`moscow_tourism_data.json?nocache=${Date.now()}`); // Добавляем параметр для предотвращения кеширования
    if (!response.ok) {
        throw new Error('Ошибка загрузки JSON-файла');
    }
    return await response.json();
}

async function setCategory(category) {
    currentCategory = category;
    document.getElementById('output').innerText = `Категория установлена: ${category}`;
}

async function showData() {
    const index = document.getElementById('indexInput').value;

    try {
        const data = await fetchData();
        const items = data[currentCategory];

        if (!items || index < 0 || index >= items.length) {
            document.getElementById('output').innerText = "Неверный индекс или категория. Попробуйте снова.";
            return;
        }

        const item = items[index];

        // Проверяем и обрабатываем возможные некорректные данные
        if (typeof item !== 'object' || item === null) {
            document.getElementById('output').innerText = "Некорректные данные элемента.";
            return;
        }

        // Преобразуем данные в JSON-строку для вывода
        document.getElementById('output').innerText = JSON.stringify(item, (key, value) => {
            if (typeof value === 'number' && isNaN(value)) {
                return 'NaN'; // Заменяем некорректные числа
            }
            return value;
        }, 4);
    } catch (error) {
        document.getElementById('output').innerText = `Ошибка: ${error.message}`;
    }
}

// Подгрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchData();
        document.getElementById('output').innerText = `Данные успешно загружены. Выберите категорию.`;
    } catch (error) {
        document.getElementById('output').innerText = `Ошибка при загрузке данных: ${error.message}`;
    }
});
