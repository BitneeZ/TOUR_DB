// Sample data (replace this with your Python dataset)
const sampleData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    values: [65, 59, 80, 81, 56],
    categories: ['A', 'B', 'A', 'C', 'B']
};

let chart1, chart2;

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts('basic');
    updateStatistics();
    populateTable();
    setupEventListeners();
});

function setupEventListeners() {
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update charts based on selected view
            updateCharts(this.dataset.view);
        });
    });
}

function updateCharts(view) {
    // Destroy existing charts
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();
    
    // Initialize new charts based on view
    initializeCharts(view);
}

function calculateStatistics() {
    const values = sampleData.values;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
        total: values.length,
        mean: mean.toFixed(2),
        max: Math.max(...values),
        min: Math.min(...values),
        stdDev: stdDev.toFixed(2)
    };
}

function getCategoryData() {
    const categoryCount = {};
    const categoryAvg = {};
    const categorySums = {};
    
    sampleData.categories.forEach((cat, idx) => {
        if (!categoryCount[cat]) {
            categoryCount[cat] = 0;
            categorySums[cat] = 0;
        }
        categoryCount[cat]++;
        categorySums[cat] += sampleData.values[idx];
    });

    Object.keys(categoryCount).forEach(cat => {
        categoryAvg[cat] = categorySums[cat] / categoryCount[cat];
    });

    return { categoryCount, categoryAvg };
}

function initializeCharts(view) {
    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');

    switch(view) {
        case 'basic':
            chart1 = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: sampleData.labels,
                    datasets: [{
                        label: 'Values Over Time',
                        data: sampleData.values,
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
                    labels: sampleData.labels,
                    datasets: [{
                        label: 'Values by Period',
                        data: sampleData.values,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            break;

        case 'distribution':
            // Create histogram data
            const binSize = 10;
            const bins = {};
            sampleData.values.forEach(value => {
                const binIndex = Math.floor(value / binSize) * binSize;
                bins[binIndex] = (bins[binIndex] || 0) + 1;
            });

            chart1 = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: Object.keys(bins),
                    datasets: [{
                        label: 'Value Distribution',
                        data: Object.values(bins),
                        backgroundColor: 'rgba(153, 102, 255, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            // Box plot data
            const stats = calculateStatistics();
            chart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Statistics'],
                    datasets: [{
                        label: 'Min-Max Range',
                        data: [stats.max - stats.min],
                        backgroundColor: 'rgba(255, 99, 132, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y'
                }
            });
            break;

        case 'category':
            const { categoryCount, categoryAvg } = getCategoryData();
            
            chart1 = new Chart(ctx1, {
                type: 'pie',
                data: {
                    labels: Object.keys(categoryCount),
                    datasets: [{
                        data: Object.values(categoryCount),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)'
                        ]
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
                    labels: Object.keys(categoryAvg),
                    datasets: [{
                        label: 'Average Value by Category',
                        data: Object.values(categoryAvg),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            break;

        case 'trend':
            // Calculate moving average
            const movingAvg = [];
            const window = 2;
            for (let i = 0; i < sampleData.values.length; i++) {
                let sum = 0;
                let count = 0;
                for (let j = Math.max(0, i - window); j <= Math.min(sampleData.values.length - 1, i + window); j++) {
                    sum += sampleData.values[j];
                    count++;
                }
                movingAvg.push(sum / count);
            }

            chart1 = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: sampleData.labels,
                    datasets: [{
                        label: 'Actual Values',
                        data: sampleData.values,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }, {
                        label: 'Moving Average',
                        data: movingAvg,
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            // Calculate period-over-period changes
            const changes = sampleData.values.map((value, index) => 
                index > 0 ? ((value - sampleData.values[index - 1]) / sampleData.values[index - 1] * 100).toFixed(1) : 0
            );

            chart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: sampleData.labels.slice(1),
                    datasets: [{
                        label: 'Period-over-Period Change (%)',
                        data: changes.slice(1),
                        backgroundColor: changes.map(change => 
                            change > 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)'
                        )
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            break;
    }
}

function updateStatistics() {
    const stats = calculateStatistics();
    document.getElementById('totalRecords').textContent = stats.total;
    document.getElementById('avgValue').textContent = stats.mean;
    document.getElementById('maxValue').textContent = stats.max;
    document.getElementById('minValue').textContent = stats.min;
    document.getElementById('stdDev').textContent = stats.stdDev;
}

function populateTable() {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = ''; // Clear existing rows
    sampleData.labels.forEach((label, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${sampleData.values[index]}</td>
            <td>${sampleData.categories[index]}</td>
        `;
        tbody.appendChild(row);
    });
}