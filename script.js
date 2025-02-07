document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    let dailyUsage = parseFloat(localStorage.getItem('dailyUsage')) || 0;
    let dailyLimit = parseFloat(localStorage.getItem('dailyLimit')) || null;
    const limitInput = document.getElementById('limit-input');
    const setLimitButton = document.getElementById('set-limit');
    const statusElement = document.getElementById('status');

    // Fetch and display usage data from API
    async function fetchUsageData() {
        try {
            const response = await fetch('http://localhost:5000/api/usage');
            const data = await response.json();
            const usageContainer = document.getElementById('usage-container');

            if (data.length) {
                const usageList = data.map(
                    (item) => `<p>${item.date}: ${item.usage_kWh} kWh</p>`
                ).join('');
                usageContainer.innerHTML = usageList;
            } else {
                usageContainer.innerHTML = 'No data available.';
            }

            // Update the chart with the latest usage data
            updateChart(data);
        } catch (error) {
            console.error('Error fetching usage data:', error);
            document.getElementById('usage-container').innerText =
                'Error loading data.';
        }
    }

    // Simulate random energy usage and update it
    setInterval(() => {
        dailyUsage += Math.random() * 0.5; // Simulate random energy usage
        updateUsageDisplay();
        localStorage.setItem('dailyUsage', dailyUsage); // Save to local storage
    }, 1000);

    function updateUsageDisplay() {
        document.getElementById('usage').textContent = `${dailyUsage.toFixed(2)} kWh`;
        if (dailyLimit !== null) {
            statusElement.textContent = dailyUsage > dailyLimit ? "Limit Exceeded!" : "Within Limit";
        }
    }

    setLimitButton.addEventListener('click', () => {
        const limit = parseFloat(limitInput.value);
        if (limit > 0) {
            dailyLimit = limit;
            localStorage.setItem('dailyLimit', dailyLimit); // Save limit
            alert('Daily limit set!');
            statusElement.textContent = "Daily limit loaded.";
        } else {
            alert('Enter a valid limit!');
        }
    });

    // Retrieve and display the usage data and update display
    fetchUsageData();

    // Initialize the Chart.js chart
    const ctx = document.getElementById('usageChart').getContext('2d');
    let usageChart;

    function updateChart(data) {
        const labels = data.map((item) => item.date);
        const usageValues = data.map((item) => parseFloat(item.usage_kWh));

        if (usageChart) {
            usageChart.destroy(); // Destroy previous chart before creating a new one
        }

        usageChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Electricity Usage (kWh)',
                    data: usageValues,
                    borderColor: '#ffea00',
                    backgroundColor: 'rgba(255, 234, 0, 0.3)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'kWh'
                        }
                    }
                }
            }
        });
    }

});
