// JSON data embedded directly into the script for local use
const jsonData = {
    "labels": [
        "kuBZRkVsAR",
        "aHKUXhjzTo",
        "dlrdYtJFTA",
        "DxmlzdGkHK",
        "WJCCQlepnz",
        "IKdhVWFKRc",
        "TKEPcTbQFY",
        "TjmJpYuNne",
        "OcCopAsiyJ",
        "pXDJPYzTeU",
        "dUCLjskBYA",
        "SqaAyIDkbd",
        "JtZrdaVVxi",
        "fXEdOCMpsk",
        "nsTgMvrDSM",
        "sYmhNXNKxf",
        "VysItOmfmB",
        "hFHhWNcgCG",
        "RWukKcGUbw",
        "eadWeHXmAV"
    ],
    "values": [
        948853,
        813627,
        508673,
        623329,
        124867,
        389886,
        416933,
        652046,
        59309,
        319068,
        25568,
        310407,
        767695,
        797939,
        677168,
        520163,
        418753,
        412795,
        96904,
        73266
    ],
    "categories": [
        "Nature",
        "Historical",
        "Nature",
        "Historical",
        "Cultural",
        "Cultural",
        "Beach",
        "Historical",
        "Cultural",
        "Adventure",
        "Urban",
        "Cultural",
        "Urban",
        "Adventure",
        "Nature",
        "Beach",
        "Historical",
        "Nature",
        "Beach",
        "Beach"
    ],
    "statistics": {
        "total_records": 20,
        "mean_visitors": 447862.45,
        "mean_rating": 2.42,
        "mean_revenue": 530464.39,
        "max_visitors": 948853,
        "min_visitors": 25568,
        "max_revenue": 989416.73,
        "min_revenue": 13352.38
    }
};

let chart1, chart2; // Global chart variables

document.addEventListener('DOMContentLoaded', function () {
    // Load JSON data and set up initial view
    loadJSONData(jsonData);

    // Set up event listeners for buttons
    setupEventListeners();
});

function loadJSONData(data) {
    try {
        updateCharts('basic', data);
        populateStatistics(data.statistics);
        populateTable(data);
    } catch (error) {
        console.error('Error loading JSON data:', error);
    }
}

function setupEventListeners() {
    const buttons = document.querySelectorAll('.control-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const view = this.dataset.view;
            if (view) updateCharts(view, jsonData);
        });
    });
}

// Update charts based on the selected view
function updateCharts(view, data) {
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();

    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');

    switch (view) {
        case 'basic':
            chart1 = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Visitors Over Locations',
                        data: data.values,
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
                    labels: data.labels,
                    datasets: [{
                        label: 'Visitors by Category',
                        data: data.values,
                        backgroundColor: 'rgba(153, 102, 255, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            break;

        case 'distribution':
            const binSize = 100;
            const bins = {};
            data.values.forEach(value => {
                const binIndex = Math.floor(value / binSize) * binSize;
                bins[binIndex] = (bins[binIndex] || 0) + 1;
            });

            chart1 = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: Object.keys(bins),
                    datasets: [{
                        label: 'Visitor Distribution',
                        data: Object.values(bins),
                        backgroundColor: 'rgba(255, 159, 64, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            chart2 = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: data.categories,
                    datasets: [{
                        label: 'Category Distribution',
                        data: data.categories.map(cat => data.categories.filter(c => c === cat).length),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(75, 192, 192, 0.5)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            break;

        case 'category':
            const categoryCount = {};
            data.categories.forEach(cat => {
                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            });

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
                    labels: Object.keys(categoryCount),
                    datasets: [{
                        label: 'Category Count',
                        data: Object.values(categoryCount),
                        backgroundColor: 'rgba(153, 102, 255, 0.5)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            break;

        case 'trend':
            const movingAvg = [];
            const window = 2;
            for (let i = 0; i < data.values.length; i++) {
                let sum = 0;
                let count = 0;
                for (let j = Math.max(0, i - window); j <= Math.min(data.values.length - 1, i + window); j++) {
                    sum += data.values[j];
                    count++;
                }
                movingAvg.push(sum / count);
            }

            chart1 = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Actual Values',
                        data: data.values,
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

            chart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Changes',
                        data: data.values.map((v, i) => i > 0 ? v - data.values[i - 1] : 0),
                        backgroundColor: 'rgba(255, 205, 86, 0.5)'
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

// Populate statistics
function populateStatistics(stats) {
    document.getElementById('totalRecords').textContent = stats.total_records;
    document.getElementById('avgValue').textContent = stats.mean_visitors.toFixed(2);
    document.getElementById('maxValue').textContent = stats.max_visitors;
    document.getElementById('minValue').textContent = stats.min_visitors;
    document.getElementById('Ещё значение').textContent = 'N/A'; // Add if you compute this in JSON
}

// Populate table
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
