let chart1, chart2;
let activeCategory = 'tourist_places';
let mockData = null;
let filteredData = null;

const filterConfigs = {
  tourist_places: [
    { key: 'minRate', label: 'Минимальный рейтинг', type: 'number', min: 0, max: 5, step: 0.1 },
    { key: 'maxPrice', label: 'Максимальная цена', type: 'number', min: 0, step: 100 }
  ],
  restaurants: [
    { key: 'kitchen', label: 'Кухня', type: 'select' },
    { key: 'minRate', label: 'Минимальный рейтинг', type: 'number', min: 0, max: 10, step: 0.1 },
    { key: 'maxPrice', label: 'Максимальная цена', type: 'number', min: 0, step: 100 }
  ],
  hotels: [
    { key: 'minRate', label: 'Минимальный рейтинг', type: 'number', min: 0, max: 10, step: 0.1 },
    { key: 'maxPrice', label: 'Максимальная цена', type: 'number', min: 0, step: 100 }
  ]
};

// Chart configuration
const chartConfig = {
  tourist_places: {
    chart1: {
      type: 'bar',
      title: 'Рейтинг мест',
      getData: (data) => ({
        labels: data.map(p => p.Name),
        datasets: [{
          label: 'Рейтинг',
          data: data.map(p => p.Rate),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1
        }]
      })
    },
    chart2: {
      type: 'bar',
      title: 'Стоимость посещения',
      getData: (data) => ({
        labels: data.map(p => p.Name),
        datasets: [{
          label: 'Цена (руб)',
          data: data.map(p => p['Price(rub)']),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      })
    }
  },
  restaurants: {
    chart1: {
      type: 'pie',
      title: 'Распределение по кухням',
      getData: (data) => {
        const kitchenCounts = data.reduce((acc, curr) => {
          acc[curr.Kitchen] = (acc[curr.Kitchen] || 0) + 1;
          return acc;
        }, {});
        return {
          labels: Object.keys(kitchenCounts),
          datasets: [{
            data: Object.values(kitchenCounts),
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)'
            ],
            borderWidth: 1
          }]
        };
      }
    },
    chart2: {
      type: 'bar',
      title: 'Рейтинг ресторанов',
      getData: (data) => ({
        labels: data.map(p => p.Name),
        datasets: [{
          label: 'Рейтинг',
          data: data.map(p => parseFloat(p.Rate)),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      })
    }
  },
  hotels: {
    chart1: {
      type: 'bar',
      title: 'Рейтинг отелей',
      getData: (data) => ({
        labels: data.map(p => p.Name),
        datasets: [{
          label: 'Рейтинг',
          data: data.map(p => p.Rate),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      })
    },
    chart2: {
      type: 'bar',
      title: 'Цены отелей',
      getData: (data) => ({
        labels: data.map(p => p.Name),
        datasets: [{
          label: 'Цена (руб)',
          data: data.map(p => parseInt(p.active_price.replace(/\s/g, ''))),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      })
    }
  }
};

function createFilterControls() {
  const filterContainer = document.getElementById('filterControls');
  filterContainer.innerHTML = '';
  
  const configs = filterConfigs[activeCategory];
  
  configs.forEach(config => {
    const filterItem = document.createElement('div');
    filterItem.className = 'filter-item';
    
    const label = document.createElement('label');
    label.className = 'filter-label';
    label.textContent = config.label;
    
    let input;
    if (config.type === 'select') {
      input = document.createElement('select');
      const uniqueValues = [...new Set(mockData[activeCategory].map(item => item[config.key]))];
      input.innerHTML = `
        <option value="">Все</option>
        ${uniqueValues.map(value => `<option value="${value}">${value}</option>`).join('')}
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
    input.addEventListener('change', applyFilters);
    
    filterItem.appendChild(label);
    filterItem.appendChild(input);
    filterContainer.appendChild(filterItem);
  });
}

function applyFilters() {
  const filters = {};
  document.querySelectorAll('.filter-input').forEach(input => {
    if (input.value) {
      filters[input.dataset.filterKey] = input.value;
    }
  });
  
  filteredData = mockData[activeCategory].filter(item => {
    if (filters.minRate && parseFloat(item.Rate) < parseFloat(filters.minRate)) return false;
    if (filters.maxPrice) {
      const price = activeCategory === 'tourist_places' 
        ? item['Price(rub)']
        : activeCategory === 'restaurants'
          ? parseInt(item.Price.split(' ')[0])
          : parseInt(item.active_price.replace(/\s/g, ''));
      if (price > parseFloat(filters.maxPrice)) return false;
    }
    if (filters.kitchen && item.Kitchen !== filters.kitchen) return false;
    return true;
  });
  
  updateCharts();
}

function updateCharts() {
  const config = chartConfig[activeCategory];
  const data = filteredData || mockData[activeCategory];

  // Destroy existing charts
  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();

  // Create new charts
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

// Function to load data with cache prevention
async function loadData() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`moscow_tourism_data.json?t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}

// Function to refresh data
async function refreshData() {
  try {
    mockData = await loadData();
    filteredData = null;
    createFilterControls();
    updateCharts();
  } catch (error) {
    document.querySelector('.container').innerHTML = `
      <h1>Ошибка загрузки данных</h1>
      <p>Пожалуйста, убедитесь, что файл data.json доступен и содержит корректные данные.</p>
    `;
  }
}

async function initializeApp() {
  try {
    // Initial data load
    await refreshData();

    // Add click handlers to buttons
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelector('button.active').classList.remove('active');
        button.classList.add('active');
        activeCategory = button.dataset.category;
        filteredData = null;
        createFilterControls();
        updateCharts();
      });
    });

    // Set up periodic refresh (every 30 seconds)
    setInterval(refreshData, 30000);

  } catch (error) {
    console.error('Error initializing app:', error);
    document.querySelector('.container').innerHTML = `
      <h1>Ошибка загрузки данных</h1>
      <p>Пожалуйста, убедитесь, что файл json доступен и содержит корректные данные.</p>
    `;
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);