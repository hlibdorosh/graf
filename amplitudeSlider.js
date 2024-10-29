// Global Variables
const ctx = document.getElementById('measurementChart').getContext('2d');
const chartData = { sine: [], cosine: [] };
let amplitude = 1;
let isMeasuring = true;

// Initialize Chart
const measurementChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Sine',
                data: chartData.sine,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                hidden: false
            },
            {
                label: 'Cosine',
                data: chartData.cosine,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                hidden: false
            }
        ]
    },
    options: {
        scales: {
            x: { display: true, title: { display: true, text: "Time" }},
            y: { beginAtZero: true, title: { display: true, text: "Amplitude" }}
        },
        plugins: {
            legend: { display: true },
            zoom: {
                enabled: false,
                mode: 'x'
            }
        }
    }
});

// Function to Update Amplitude Value
function updateAmplitude(value) {
    amplitude = parseFloat(value);
    console.log("Amplitude updated to:", amplitude);
}

// Establish a Server-Sent Events (SSE) Connection
const eventSource = new EventSource('https://old.iolab.sk/evaluation/sse/sse.php');

eventSource.onmessage = function(event) {
    if (!isMeasuring) return;

    try {
        // Log the raw data received to inspect its structure
        console.log("Raw data received:", event.data);

        // Parse the data as JSON based on observed structure
        const data = JSON.parse(event.data);

        // Verify the parsed data structure and retrieve values
        const time = parseInt(data.x, 10);  // Use `x` as the time
        const sineValue = amplitude * parseFloat(data.y1); // `y1` as sine value
        const cosineValue = amplitude * parseFloat(data.y2); // `y2` as cosine value

        console.log("Parsed Sine Value:", sineValue);
        console.log("Parsed Cosine Value:", cosineValue);

        // Push the sine and cosine values to chartData arrays
        chartData.sine.push(sineValue);
        chartData.cosine.push(cosineValue);
        measurementChart.data.labels.push(time);
        measurementChart.data.datasets[0].data = chartData.sine;
        measurementChart.data.datasets[1].data = chartData.cosine;

        // Update the chart
        measurementChart.update();
        console.log("Data added:", { time, sineValue, cosineValue });
    } catch (error) {
        console.error("Error parsing data:", error);
    }
};

// Checkbox controls for showing/hiding sine and cosine lines
document.getElementById('showSine').addEventListener('change', (e) => {
    measurementChart.getDatasetMeta(0).hidden = !e.target.checked;
    measurementChart.update();
});

document.getElementById('showCosine').addEventListener('change', (e) => {
    measurementChart.getDatasetMeta(1).hidden = !e.target.checked;
    measurementChart.update();
});

// Button to End Measurement
document.getElementById('endButton').addEventListener('click', () => {
    isMeasuring = false;
    eventSource.close(); // Close the SSE connection
    measurementChart.options.plugins.zoom.enabled = true; // Enable zoom after stopping measurement
    measurementChart.update();
    console.log("Measurement ended");
});
