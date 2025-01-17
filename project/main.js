let chart1, chart2;
let activeCategory = 'tourist_places';
let mockData = null;

// Chart configuration
const chartConfig = {
  tourist_places: {
    chart1: {
      type: 'bar',
      title: 'Рейтинг мест',
      getData: (data) => ({
        labels: data.places.map(p => p.name),
        datasets: [{
          label: 'Рейтинг',
          data: data.places.map(p => p.rate),
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
        labels: data.places.map(p => p.name),
        datasets: [{
          label: 'Цена (руб)',
          data: data.places.map(p => p.price),
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
      getData: (data) => ({
        labels: Object.keys(data.kitchenStats),
        datasets: [{
          data: Object.values(data.kitchenStats),
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
      })
    },
    chart2: {
      type: 'bar',
      title: 'Рейтинг ресторанов',
      getData: (data) => ({
        labels: data.places.map(p => p.name),
        datasets: [{
          label: 'Рейтинг',
          data: data.places.map(p => p.rate),
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
        labels: data.places.map(p => p.name),
        datasets: [{
          label: 'Рейтинг',
          data: data.places.map(p => p.rate),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      })
    },
    chart2: {
      type: 'pie',
      title: 'Распределение по станциям метро',
      getData: (data) => ({
        labels: Object.keys(data.metroStats),
        datasets: [{
          data: Object.values(data.metroStats),
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
      })
    }
  }
};

// Create or update charts
function updateCharts() {
  const config = chartConfig[activeCategory];
  const data = mockData[activeCategory];

  // Update statistics
  document.getElementById('avgVisitors').textContent = data.stats.avgVisitors;
  document.getElementById('avgRating').textContent = data.stats.avgRating;
  document.getElementById('totalPlaces').textContent = data.stats.totalPlaces;

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

// Load JSON data and initialize
async function initializeApp() {
  try {
    const response = await fetch(`data.json?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    mockData = await response.json();

    // Add click handlers to buttons
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        // Update active button
        document.querySelector('button.active').classList.remove('active');
        button.classList.add('active');
        
        // Update charts
        activeCategory = button.dataset.category;
        updateCharts();
      });
    });

    // Initial render
    updateCharts();
  } catch (error) {
    console.error('Error loading data:', error);
    document.querySelector('.container').innerHTML = `
      <h1>Ошибка загрузки данных</h1>
      <p>Пожалуйста, убедитесь, что файл data.json доступен и содержит корректные данные.</p>
    `;
  }
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);