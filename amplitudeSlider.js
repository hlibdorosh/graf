// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Global Variables
    const ctx = document.getElementById('measurementChart').getContext('2d');
    const chartData = { sine: [], cosine: [] };
    let amplitude = 5; // Set default amplitude to the initial slider value
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

    // Set up the amplitude slider and number input
    const amplitudeSlider = document.getElementById('amplitudeSlider');
    const amplitudeNumber = document.getElementById('amplitudeNumber');

    // Function to synchronize both the slider and the number input
    function updateAmplitudeInputs(value) {
        amplitude = parseFloat(value);
        amplitudeSlider.value = value;
        amplitudeNumber.value = value;
        document.getElementById('amplitudeValue').textContent = value;
        console.log("Amplitude updated to:", amplitude);
    }

    // Event listener for the slider input
    amplitudeSlider.addEventListener('input', (event) => {
        updateAmplitudeInputs(event.target.value);
    });

    // Event listener for the number input
    amplitudeNumber.addEventListener('input', (event) => {
        let value = parseFloat(event.target.value);
        // Ensure the number input stays within the slider's range
        if (value < parseFloat(amplitudeSlider.min)) value = amplitudeSlider.min;
        if (value > parseFloat(amplitudeSlider.max)) value = amplitudeSlider.max;
        updateAmplitudeInputs(value);
    });

    // Establish a Server-Sent Events (SSE) Connection to fetch data
    const eventSource = new EventSource('https://old.iolab.sk/evaluation/sse/sse.php');

    eventSource.onmessage = function(event) {
        if (!isMeasuring) return;

        try {
            // Log the raw data received to inspect its structure
            console.log("Raw data received:", event.data);

            // Parse the data as JSON based on observed structure
            const data = JSON.parse(event.data);

            // Retrieve values from the data structure
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
});
