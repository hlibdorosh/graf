document.addEventListener("DOMContentLoaded", function () {
    let barChart, totalGradesChart;

    // Function to load and parse XML
    function loadXMLData() {
        fetch("z03.xml")
            .then((response) => response.text())
            .then((xmlText) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "application/xml");
                displayBarChart(xmlDoc);
                displayDoughnutCharts(xmlDoc);
                displayTotalGradesChart(xmlDoc);
            })
            .catch((error) => console.error("Error fetching XML:", error));
    }

    // Function to determine if screen is small
    function isSmallScreen() {
        return window.innerWidth < 768;
    }

    // Function to display main bar chart
    function displayBarChart(xmlDoc) {
        const records = xmlDoc.getElementsByTagName("zaznam");

        const labels = [];
        const dataA = [];
        const dataB = [];
        const dataC = [];
        const dataD = [];
        const dataE = [];
        const dataFX = [];
        const dataFN = [];

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

        function createOrUpdateChart() {
            if (barChart) {
                barChart.destroy();
            }

            const ctx = document.getElementById("statisticsChart").getContext("2d");
            barChart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        { label: "A", data: dataA, backgroundColor: "rgba(54, 162, 235, 0.6)", borderColor: "black", borderWidth: 2 },
                        { label: "B", data: dataB, backgroundColor: "rgba(255, 206, 86, 0.6)", borderColor: "black", borderWidth: 2 },
                        { label: "C", data: dataC, backgroundColor: "rgba(75, 192, 192, 0.6)", borderColor: "black", borderWidth: 2 },
                        { label: "D", data: dataD, backgroundColor: "rgba(153, 102, 255, 0.6)", borderColor: "black", borderWidth: 2 },
                        { label: "E", data: dataE, backgroundColor: "rgba(255, 99, 132, 0.6)", borderColor: "black", borderWidth: 2 },
                        { label: "FX", data: dataFX, backgroundColor: "rgba(255, 159, 64, 0.6)", borderColor: "black", borderWidth: 2 },
                        { label: "FN", data: dataFN, backgroundColor: "rgba(201, 203, 207, 0.6)", borderColor: "black", borderWidth: 2 }
                    ]
                },
                options: {
                    indexAxis: isSmallScreen() ? 'y' : 'x',
                    scales: {
                        x: { beginAtZero: true, stacked: true },
                        y: { beginAtZero: true, stacked: true }
                    },
                    plugins: {
                        title: { display: true, text: "Academic Performance by Year" },
                        legend: { position: 'top' }
                    }
                }
            });
        }

        createOrUpdateChart();

        window.addEventListener("resize", createOrUpdateChart);
    }

    // Function to display total grades chart as a doughnut chart
    function displayTotalGradesChart(xmlDoc) {
        const records = xmlDoc.getElementsByTagName("zaznam");

        let totalA = 0, totalB = 0, totalC = 0, totalD = 0, totalE = 0, totalFX = 0, totalFN = 0;

        Array.from(records).forEach((record) => {
            const ratings = record.getElementsByTagName("hodnotenie")[0];
            totalA += parseInt(ratings.getElementsByTagName("A")[0].textContent);
            totalB += parseInt(ratings.getElementsByTagName("B")[0].textContent);
            totalC += parseInt(ratings.getElementsByTagName("C")[0].textContent);
            totalD += parseInt(ratings.getElementsByTagName("D")[0].textContent);
            totalE += parseInt(ratings.getElementsByTagName("E")[0].textContent);
            totalFX += parseInt(ratings.getElementsByTagName("FX")[0].textContent);
            totalFN += parseInt(ratings.getElementsByTagName("FN")[0].textContent);
        });

        const ctx = document.getElementById("totalGradesChart").getContext("2d");
        totalGradesChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["A", "B", "C", "D", "E", "FX", "FN"],
                datasets: [{
                    label: "Total Students by Grade",
                    data: [totalA, totalB, totalC, totalD, totalE, totalFX, totalFN],
                    backgroundColor: [
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(255, 159, 64, 0.6)",
                        "rgba(201, 203, 207, 0.6)"
                    ],
                    borderColor: "black",
                    borderWidth: 2
                }]
            },
            options: {
                plugins: {
                    title: { display: true, text: "Total Students by Grade Across All Years" },
                    legend: { position: 'right' }
                }
            }
        });
    }

    // Function to display doughnut charts for each year (unchanged)
    function displayDoughnutCharts(xmlDoc) {
        const records = xmlDoc.getElementsByTagName("zaznam");
        const doughnutContainer = document.getElementById("doughnutCharts");

        Array.from(records).forEach((record, index) => {
            const year = record.getElementsByTagName("rok")[0].textContent;
            const ratings = record.getElementsByTagName("hodnotenie")[0];

            const data = [
                parseInt(ratings.getElementsByTagName("A")[0].textContent),
                parseInt(ratings.getElementsByTagName("B")[0].textContent),
                parseInt(ratings.getElementsByTagName("C")[0].textContent),
                parseInt(ratings.getElementsByTagName("D")[0].textContent),
                parseInt(ratings.getElementsByTagName("E")[0].textContent),
                parseInt(ratings.getElementsByTagName("FX")[0].textContent),
                parseInt(ratings.getElementsByTagName("FN")[0].textContent)
            ];

            const colDiv = document.createElement("div");
            colDiv.className = "col-md-4 my-3 text-center";

            const title = document.createElement("h2");
            title.innerText = `Grade Distribution for ${year}`;
            title.style.marginBottom = "0";
            colDiv.appendChild(title);

            const canvas = document.createElement("canvas");
            canvas.id = `doughnutChart${index}`;
            colDiv.appendChild(canvas);

            doughnutContainer.appendChild(colDiv);

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
                        borderColor: "black",
                        borderWidth: 2
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

    loadXMLData();
});
