document.addEventListener("DOMContentLoaded", function () {
    let barChart;

    // Function to load and parse XML
    function loadXMLData() {
        fetch("z03.xml")
            .then((response) => response.text())
            .then((xmlText) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "application/xml");
                displayBarChart(xmlDoc);
                displayDoughnutCharts(xmlDoc);
            })
            .catch((error) => console.error("Error fetching XML:", error));
    }

    // Function to determine if screen is small
    function isSmallScreen() {
        return window.innerWidth < 768; // Adjust breakpoint as needed
    }

// Function to display main bar chart
    function displayBarChart(xmlDoc) {
        const records = xmlDoc.getElementsByTagName("zaznam");

        // Prepare data arrays for the bar chart
        const labels = [];
        const dataA = [];
        const dataB = [];
        const dataC = [];
        const dataD = [];
        const dataE = [];
        const dataFX = [];
        const dataFN = [];

        // Extract data from XML and populate arrays
        Array.from(records).forEach((record) => {
            const year = record.getElementsByTagName("rok")[0].textContent;
            labels.push(year);

            const ratings = record.getElementsByTagName("hodnotenie")[0];
            dataA.push(parseInt(ratings.getElementsByTagName("A")[0].textContent));
            dataB.push(parseInt(ratings.getElementsByTagName("B")[0].textContent));
            dataC.push(parseInt(ratings.getElementsByTagName("C")[0].textContent));
            dataD.push(parseInt(ratings.getElementsByTagName("D")[0].textContent));
            dataE.push(parseInt(ratings.getElementsByTagName("E")[0].textContent));
            dataFX.push(parseInt(ratings.getElementsByTagName("FX")[0].textContent));
            dataFN.push(parseInt(ratings.getElementsByTagName("FN")[0].textContent));
        });

        // Function to create or update the chart
        function createOrUpdateChart() {
            // Destroy the existing chart if it exists
            if (barChart) {
                barChart.destroy();
            }

            const ctx = document.getElementById("statisticsChart").getContext("2d");
            barChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "A",
                            data: dataA,
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                            borderColor: "black", // Set border color to black
                            borderWidth: 2 // Adjust border width if necessary
                        },
                        {
                            label: "B",
                            data: dataB,
                            backgroundColor: "rgba(255, 206, 86, 0.6)",
                            borderColor: "black",
                            borderWidth: 2
                        },
                        {
                            label: "C",
                            data: dataC,
                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                            borderColor: "black",
                            borderWidth: 2
                        },
                        {
                            label: "D",
                            data: dataD,
                            backgroundColor: "rgba(153, 102, 255, 0.6)",
                            borderColor: "black",
                            borderWidth: 2
                        },
                        {
                            label: "E",
                            data: dataE,
                            backgroundColor: "rgba(255, 99, 132, 0.6)",
                            borderColor: "black",
                            borderWidth: 2
                        },
                        {
                            label: "FX",
                            data: dataFX,
                            backgroundColor: "rgba(255, 159, 64, 0.6)",
                            borderColor: "black",
                            borderWidth: 2
                        },
                        {
                            label: "FN",
                            data: dataFN,
                            backgroundColor: "rgba(201, 203, 207, 0.6)",
                            borderColor: "black",
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    indexAxis: isSmallScreen() ? 'y' : 'x', // Toggle axis orientation
                    scales: {
                        x: { beginAtZero: true, stacked: true },
                        y: { beginAtZero: true, stacked: true }
                    },
                    plugins: {
                        title: { display: true, text: "Academic Performance by Year" },
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
        }

        // Initial chart render
        createOrUpdateChart();

        // Listen for window resize and update chart orientation if needed
        window.addEventListener("resize", function () {
            // Redraw the chart with the appropriate orientation when screen size changes
            createOrUpdateChart();
        });
    }


    // Function to display doughnut charts for each year
    function displayDoughnutCharts(xmlDoc) {
        const records = xmlDoc.getElementsByTagName("zaznam");
        const doughnutContainer = document.getElementById("doughnutCharts");

        // Iterate over each record to create a doughnut chart for each year
        Array.from(records).forEach((record, index) => {
            const year = record.getElementsByTagName("rok")[0].textContent;
            const ratings = record.getElementsByTagName("hodnotenie")[0];

            // Extract individual grade data
            const data = [
                parseInt(ratings.getElementsByTagName("A")[0].textContent),
                parseInt(ratings.getElementsByTagName("B")[0].textContent),
                parseInt(ratings.getElementsByTagName("C")[0].textContent),
                parseInt(ratings.getElementsByTagName("D")[0].textContent),
                parseInt(ratings.getElementsByTagName("E")[0].textContent),
                parseInt(ratings.getElementsByTagName("FX")[0].textContent),
                parseInt(ratings.getElementsByTagName("FN")[0].textContent)
            ];

            // Create a container and canvas for each doughnut chart
            const colDiv = document.createElement("div");
            colDiv.className = "col-md-4 my-3 text-center";

            const title = document.createElement("h2");
            title.innerText = `Grade Distribution for ${year}`;
            title.style.marginBottom = "0"; // Ensures title is close to the chart
            colDiv.appendChild(title);

            const canvas = document.createElement("canvas");
            canvas.id = `doughnutChart${index}`;
            colDiv.appendChild(canvas);

            doughnutContainer.appendChild(colDiv);

            // Create the doughnut chart
            new Chart(canvas.getContext("2d"), {
                type: "doughnut",
                data: {
                    labels: ["A", "B", "C", "D", "E", "FX", "FN"],
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(255, 159, 64, 0.6)",
                            "rgba(201, 203, 207, 0.6)"
                        ],
                        borderColor: "black", // Set border color to black
                        borderWidth: 2 // Adjust the border width if necessary
                    }]
                },
                options: {
                    plugins: {
                        title: { display: false },
                        legend: { position: 'right' }
                    }
                }
            });
        });
    }

    // Load XML data when page is ready
    loadXMLData();
});
