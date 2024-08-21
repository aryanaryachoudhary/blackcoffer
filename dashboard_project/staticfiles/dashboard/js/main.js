function fetchDataAndDisplayChart(filters = {}) {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            let filteredData = data.filter(d => 
                (!filters.endYear || d.end_year == filters.endYear) &&
                (!filters.topics || d.topic.includes(filters.topics)) &&
                (!filters.sector || d.sector == filters.sector) &&
                (!filters.region || d.region == filters.region) &&
                d.intensity !== "" && !isNaN(d.intensity) &&
                d.likelihood !== "" && !isNaN(d.likelihood) &&
                d.relevance !== "" && !isNaN(d.relevance) &&
                d.start_year &&
                d.topic && typeof d.topic === 'string' && d.topic.trim() !== "" // topic is not undefined or an empty string
            );

            const labels = filteredData.map(d => d.start_year || 'N/A');
            const intensityData = filteredData.map(d => d.intensity);
            const likelihoodData = filteredData.map(d => d.likelihood);
            const relevanceData = filteredData.map(d => d.relevance);

            const countryData = {};
            const topicData = {};
            filteredData.forEach(d => {
                countryData[d.country] = (countryData[d.country] || 0) + 1;
                topicData[d.topic] = (topicData[d.topic] || 0) + d.intensity + d.likelihood + d.relevance;
            });

            const cityYearData = {};
            filteredData.forEach(d => {
                if (d.start_year && d.city) {
                    cityYearData[d.start_year] = cityYearData[d.start_year] || {};
                    cityYearData[d.start_year][d.city] = (cityYearData[d.start_year][d.city] || 0) + 1;
                }
            });

            createBarChart(labels, intensityData, likelihoodData, relevanceData);
            createLineChart(labels, intensityData);
            createPieChart(Object.keys(topicData), Object.values(topicData));
            createHeatmap(intensityData, likelihoodData, relevanceData);
            createCityYearChart(cityYearData);

        })
        .catch(error => console.error('Error:', error));
}


function createBarChart(labels, intensityData, likelihoodData, relevanceData) {
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
        chartContainer.innerHTML = '<canvas id="myChart"></canvas>';
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Intensity',
                    data: intensityData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Likelihood',
                    data: likelihoodData,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Relevance',
                    data: relevanceData,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createLineChart(labels, intensityData) {
    const lineChartContainer = document.getElementById('line-chart-container');
    if (lineChartContainer) {
        lineChartContainer.innerHTML = '<canvas id="lineChart"></canvas>';
    }

    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Intensity Over Time',
                data: intensityData,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function createPieChart(labels, data) {
    const pieChartContainer = document.getElementById('pie-chart-container');
    if (pieChartContainer) {
        pieChartContainer.innerHTML = '<canvas id="pieChart"></canvas>';
    }

    // Generate random colors for each segment of the pie chart
    const backgroundColors = labels.map(() => getRandomColor());
    const borderColors = labels.map(() => getRandomColor());

    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
         data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        }
    });
}

function createHeatmap(data) {
    // Aggregate data by topic
    const aggregatedData = {};
    data.forEach(d => {
        if (!aggregatedData[d.topic]) {
            aggregatedData[d.topic] = {
                intensity: 0,
                likelihood: 0,
                relevance: 0
            };
        }
        // Check if the values are not empty and are numbers before adding them
        aggregatedData[d.topic].intensity += d.intensity && !isNaN(d.intensity) ? Number(d.intensity) : 0;
        aggregatedData[d.topic].likelihood += d.likelihood && !isNaN(d.likelihood) ? Number(d.likelihood) : 0;
        aggregatedData[d.topic].relevance += d.relevance && !isNaN(d.relevance) ? Number(d.relevance) : 0;
    });

    const topics = Object.keys(aggregatedData);
    const intensityData = topics.map(topic => aggregatedData[topic].intensity);
    const likelihoodData = topics.map(topic => aggregatedData[topic].likelihood);
    const relevanceData = topics.map(topic => aggregatedData[topic].relevance);

    // Log the data to check if it's correct
    console.log('Aggregated data:', aggregatedData);
    console.log('Topics:', topics);
    console.log('Intensity data:', intensityData);
    console.log('Likelihood data:', likelihoodData);
    console.log('Relevance data:', relevanceData);

    const trace = {
        x: topics,
        y: ['Intensity', 'Likelihood', 'Relevance'],
        z: [intensityData, likelihoodData, relevanceData],
        type: 'heatmap'
    };

    const layout = {
        title: 'Heatmap of Intensity, Likelihood, and Relevance by Topic',
        xaxis: { title: 'Topic' },
        yaxis: { title: 'Variable' }
    };
    console.log('Plotting heatmap...');
    Plotly.newPlot('heatmap', [trace], layout);
}


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Store the chart instances in variables so they can be updated later
let barChart;
let lineChart;
let pieChart;


function createCityYearChart(data) {
    console.log(data);
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        // Prepare a list of all unique cities
        const allCities = [...new Set([].concat(...Object.values(data).map(d => Object.keys(d)).filter(city => city !== "")))];
    
        // Prepare the data array with headers
        const dataArray = [['Year', ...allCities]];
    
        // Add data for each year
        for (const year in data) {
            if (year !== "") {
                const row = [Number(year)];
                allCities.forEach(city => {
                    row.push(data[year][city] || 0);
                });
                dataArray.push(row);
            }
        }
    
        var data = google.visualization.arrayToDataTable(dataArray);
    
        var options = {
            title: 'City Events per Year',
            hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
            vAxis: {minValue: 0}
        };
    
        var chart = new google.visualization.AreaChart(document.getElementById('city-year-chart-container'));
        chart.draw(data, options);
    }
    
}

fetchDataAndDisplayChart();

window.addEventListener('DOMContentLoaded', (event) => {
    const applyFiltersButton = document.getElementById('apply-filters');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', function () {
            const filters = {
                endYear: document.getElementById('end-year').value,
                topics: document.getElementById('topics').value,
                sector: document.getElementById('sector').value,
                region: document.getElementById('region').value
            };
            fetchDataAndDisplayChart(filters);
        });
    }
});
