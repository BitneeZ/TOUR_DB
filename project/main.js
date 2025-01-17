document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.control-btn');

    // Установить обработчики событий для кнопок
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const view = this.dataset.view; // Получить ключ набора данных
            let dataset;

            // Проверяем, какой набор данных выбрать
            switch (view) {
                case 'tourist_places':
                    dataset = jsonData.tourist_places;
                    break;
                case 'restaurants':
                    dataset = jsonData.restaurants;
                    break;
                case 'hotels':
                    dataset = jsonData.hotels;
                    break;
                default:
                    console.error('Неизвестный ключ для view:', view);
                    return;
            }

            // Обновляем данные
            updateCharts(view, dataset);
            populateStatistics(dataset.statistics);
            populateTable(dataset);
        });
    });

    // Загружаем данные по умолчанию (например, туристические места)
    const defaultView = 'tourist_places';
    const defaultDataset = jsonData.tourist_places;
    updateCharts(defaultView, defaultDataset);
    populateStatistics(defaultDataset.statistics);
    populateTable(defaultDataset);
});

function updateCharts(view, dataset) {
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();

    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');

    chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: dataset.labels,
            datasets: [{
                label: `Данные для ${view}`,
                data: dataset.values,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    chart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: dataset.labels,
            datasets: [{
                label: `Данные для ${view}`,
                data: dataset.values,
                backgroundColor: 'rgba(153, 102, 255, 0.5)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function populateStatistics(stats) {
    document.getElementById('totalRecords').textContent = stats.total_records;
    document.getElementById('avgValue').textContent = stats.mean_visitors.toFixed(2);
    document.getElementById('maxValue').textContent = stats.max_visitors;
    document.getElementById('minValue').textContent = stats.min_visitors;
    document.getElementById('Ещё значение').textContent = 'N/A'; // Добавьте дополнительные значения, если необходимо
}

function populateTable(dataset) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = ''; // Очищаем существующие строки

    dataset.labels.forEach((label, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${dataset.values[index]}</td>
            <td>${dataset.categories[index]}</td>
        `;
        tbody.appendChild(row);
    });
}