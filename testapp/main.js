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

// Utility functions
function normalizePrice(price) {
  if (!price) return 0;
  return parseInt(price.toString().replace(/\s/g, ''));
}

function getPriceRange(price) {
  const normalizedPrice = normalizePrice(price);
  if (normalizedPrice <= 700) return '700';
  if (normalizedPrice <= 1700) return '700-1700';
  if (normalizedPrice <= 3000) return '1700-3000';
  return '3000';
}

// Get unique kitchens from data
function getUniqueKitchens(data) {
  const kitchens = new Set();
  data.forEach(item => {
    if (item.Kitchen) {
      kitchens.add(item.Kitchen);
    }
  });
  return Array.from(kitchens).sort();
}

// Chart configuration
const chartConfig = {
  tourist_places: {
    chart1: {
      type: 'bar',
      title: 'Стоимость достопримечательностей',
      getData: (data) => {
        const sortedData = [...data].sort((a, b) => b['Price(rub)'] - a['Price(rub)']);
        return {
          labels: sortedData.map(p => p.Name),
          datasets: [{
            label: 'Цена (руб)',
            data: sortedData.map(p => p['Price(rub)'] || 0),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderColor: 'rgb(53, 162, 235)',
            borderWidth: 1
          }]
        };
      }
    },
    chart2: {
      type: 'bar',
      title: 'Рейтинг достопримечательностей',
      getData: (data) => {
        const sortedData = [...data].sort((a, b) => b.Rate - a.Rate);
        return {
          labels: sortedData.map(p => p.Name),
          datasets: [{
            label: 'Рейтинг',
            data: sortedData.map(p => p.Rate),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
          }]
        };
      }
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
      getData: (data) => {
        const sortedData = [...data].sort((a, b) => parseFloat(b.Rate) - parseFloat(a.Rate));
        return {
          labels: sortedData.map(p => p.Name),
          datasets: [{
            label: 'Рейтинг',
            data: sortedData.map(p => parseFloat(p.Rate)),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
          }]
        };
      }
    }
  },
  hotels: {
    chart1: {
      type: 'bar',
      title: 'Отели: цены и рейтинги',
      getData: (data) => {
        const sortedData = [...data].sort((a, b) => b.Rate - a.Rate);
        return {
          labels: sortedData.map(p => p.Name),
          datasets: [
            {
              label: 'Рейтинг',
              data: sortedData.map(p => p.Rate),
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Цена (руб)',
              data: sortedData.map(p => normalizePrice(p.active_price)),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1,
              yAxisID: 'y1'
            }
          ]
        };
      }
    },
    chart2: {
      type: 'pie',
      title: 'Распределение цен отелей',
      getData: (data) => {
        const priceRanges = {
          'до 3000': 0,
          '3000-5000': 0,
          '5000-10000': 0,
          'более 10000': 0
        };
        
        data.forEach(hotel => {
          const price = normalizePrice(hotel.active_price);
          if (price <= 3000) priceRanges['до 3000']++;
          else if (price <= 5000) priceRanges['3000-5000']++;
          else if (price <= 10000) priceRanges['5000-10000']++;
          else priceRanges['более 10000']++;
        });

        return {
          labels: Object.keys(priceRanges),
          datasets: [{
            data: Object.values(priceRanges),
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)'
            ],
            borderWidth: 1
          }]
        };
      }
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
      if (config.key === 'kitchen') {
        const uniqueKitchens = getUniqueKitchens(mockData[activeCategory]);
        input.innerHTML = `
          <option value="">Все</option>
          ${uniqueKitchens.map(kitchen => `<option value="${kitchen}">${kitchen}</option>`).join('')}
        `;
      } else if (config.key === 'priceRange') {
        input.innerHTML = `
          <option value="">Все</option>
          ${config.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
        `;
      }
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
        : normalizePrice(activeCategory === 'hotels' ? item.active_price : item.Price);
      if (price > parseFloat(filters.maxPrice)) return false;
    }
    
    if (filters.kitchen && item.Kitchen !== filters.kitchen) return false;
    
    if (filters.priceRange) {
      const itemPriceRange = getPriceRange(item.Price);
      if (itemPriceRange !== filters.priceRange) return false;
    }
    
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
      },
      ...(activeCategory === 'hotels' && config.chart1.type === 'bar' ? {
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Рейтинг'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Цена (руб)'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      } : {})
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
    // Add timestamp to URL to prevent caching
    const timestamp = new Date().getTime();
    const response = await fetch(`data.json?t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    
    const data = await response.json();
    return data;
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
      <p>Пожалуйста, убедитесь, что файл data.json доступен и содержит корректные данные.</p>
    `;
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);