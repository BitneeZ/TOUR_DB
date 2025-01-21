let chart1, chart2;
let activeCategory = 'tourist_places';
let mockData = null; // Данные из MongoDB
let filteredData = null;
let currentFilters = {}; // Текущие фильтры

const filterConfigs = {
  tourist_places: [
    { key: 'minRate', label: 'Минимальный рейтинг', type: 'number', min: 0, max: 5, step: 0.1 },
    { key: 'maxPrice', label: 'Максимальная цена', type: 'number', min: 0, step: 100 }
  ],
  restaurants: [
    { key: 'kitchen', label: 'Кухня', type: 'select' },
    { key: 'minRate', label: 'Минимальный рейтинг', type: 'number', min: 0, max: 10, step: 0.1 },
    { key: 'priceRange', label: 'Ценовой диапазон', type: 'select', options: [
      { value: '700', label: 'до 700' },
      { value: '700-1700', label: '700-1700' },
      { value: '1700-3000', label: '1700-3000' },
      { value: '3000', label: 'от 3000' }
    ]}
  ],
  hotels: [
    { key: 'minRate', label: 'Минимальный рейтинг', type: 'number', min: 0, max: 10, step: 0.1 },
    { key: 'maxPrice', label: 'Максимальная цена', type: 'number', min: 0, step: 1000 }
  ]
};

// Подключение данных с API
async function loadData() {
  try {
    const response = await fetch('/data'); // Подключаемся к серверу
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
    throw err;
  }
}

// Применение фильтров к данным
function applyFilters() {
  filteredData = mockData[activeCategory].filter(item => {
    if (currentFilters.minRate && item.Rate < currentFilters.minRate) return false;
    if (currentFilters.maxPrice && item['Price(rub)'] > currentFilters.maxPrice) return false;
    if (currentFilters.kitchen && item.Kitchen !== currentFilters.kitchen) return false;
    return true;
  });
  updateCharts();
}

// Создание фильтров
function createFilterControls() {
  const filterContainer = document.getElementById('filterControls');
  filterContainer.innerHTML = '';
  const configs = filterConfigs[activeCategory];

  configs.forEach(config => {
    const wrapper = document.createElement('div');
    wrapper.className = 'filter-item';

    const label = document.createElement('label');
    label.textContent = config.label;
    label.className = 'filter-label';

    let input;
    if (config.type === 'select') {
      input = document.createElement('select');
      input.innerHTML = `
        <option value="">Все</option>
        ${config.options ? config.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('') : ''}
      `;
    } else {
      input = document.createElement('input');
      input.type = config.type;
      if (config.min !== undefined) input.min = config.min;
      if (config.max !== undefined) input.max = config.max;
      if (config.step !== undefined) input.step = config.step;
    }

    input.className = 'filter-input';
    input.dataset.filterKey = config.key;
    input.addEventListener('change', () => {
      currentFilters[config.key] = input.value || null;
      applyFilters();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    filterContainer.appendChild(wrapper);
  });
}

// Обновление графиков
function updateCharts() {
  const data = filteredData || mockData[activeCategory];
  const config = chartConfig[activeCategory];

  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();

  chart1 = new Chart(document.getElementById('chart1'), {
    type: config.chart1.type,
    data: config.chart1.getData(data),
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: config.chart1.title }
      }
    }
  });

  chart2 = new Chart(document.getElementById('chart2'), {
    type: config.chart2.type,
    data: config.chart2.getData(data),
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: config.chart2.title }
      }
    }
  });
}

// Обновление данных
async function refreshData() {
  try {
    mockData = await loadData(); // Получаем данные с сервера
    filteredData = null;
    createFilterControls(); // Создаём фильтры
    updateCharts(); // Обновляем графики
  } catch (err) {
    console.error('Ошибка при обновлении данных:', err);
  }
}

// Инициализация приложения
async function initializeApp() {
  try {
    await refreshData();

    // Кнопки для переключения категорий
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelector('button.active').classList.remove('active');
        button.classList.add('active');
        activeCategory = button.dataset.category;
        createFilterControls();
        updateCharts();
      });
    });

    setInterval(refreshData, 30000); // Обновляем данные каждые 30 секунд
  } catch (err) {
    console.error('Ошибка инициализации:', err);
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);