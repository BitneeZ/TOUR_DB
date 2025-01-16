let chart1, chart2;

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData(); // Load data from JSON
    initializeCharts('basic', data);
    updateStatistics(data);
    populateTable(data);
    setupEventListeners(data);
});

// Fetch data from JSON file
async function fetchData() {
    const response = await fetch('C:/Users/pisma/Desktop/TOUR_DB/tourism_dashboard.json'); // Укажите путь к JSON-файлу
    return await response.json();
}

function setupEventListeners(data) {
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update charts based on selected view
            updateCharts(this.dataset.view, data);
        });
    });
}

function updateCharts(view, data) {
    // Destroy existing charts
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();

    // Initialize new charts based on view
    initializeCharts(view, data);
}

function calculateStatistics(data) {
    const values = data.values;
    const mean =
        values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
        values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
        total: values.length,
        mean: mean.toFixed(2),
        max: Math.max(...values),
        min: Math.min(...values),
        stdDev: stdDev.toFixed(2),
    };
}

function getCategoryData(data) {
    const categoryCount = {};
    const categoryAvg = {};
    const categorySums = {};

    data.categories.forEach((cat, idx) => {
        if (!categoryCount[cat]) {
            categoryCount[cat] = 0;
            categorySums[cat] = 0;
        }
        categoryCount[cat]++;
        categorySums[cat] += data.values[idx];
    });

    Object.keys(categoryCount).forEach(cat => {
        categoryAvg[cat] = categorySums[cat] / categoryCount[cat];
    });

    return { categoryCount, categoryAvg };
}

function initializeCharts(view, data) {
    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');

    switch (view) {
        case 'basic':
            chart1 = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Values Over Time',
                        data: data.values,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });

            chart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Values by Period',
                        data: data.values,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
            break;

        case 'category':
            const { categoryCount, categoryAvg } = getCategoryData(data);

            chart1 = new Chart(ctx1, {
                type: 'pie',
                data: {
                    labels: Object.keys(categoryCount),
                    datasets: [{
                        data: Object.values(categoryCount),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                        ],
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });

            chart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: Object.keys(categoryAvg),
                    datasets: [{
                        label: 'Average Value by Category',
                        data: Object.values(categoryAvg),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
            break;

        // Add more cases as needed
    }
}

function updateStatistics(data) {
    const stats = calculateStatistics(data);
    document.getElementById('totalRecords').textContent = stats.total;
    document.getElementById('avgValue').textContent = stats.mean;
    document.getElementById('maxValue').textContent = stats.max;
    document.getElementById('minValue').textContent = stats.min;
    document.getElementById('stdDev').textContent = stats.stdDev;
}

function populateTable(data) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = ''; // Clear existing rows
    data.labels.forEach((label, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.values[index]}</td>
            <td>${data.categories[index]}</td>
        `;
        tbody.appendChild(row);
    });
}