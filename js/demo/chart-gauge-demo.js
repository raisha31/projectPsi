// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"), '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

// Install Chart.js (if not already installed)
// npm install chart.js

// HTML structure for the gauge chart

// JavaScript code for creating the gauge chart
const ctx = document.getElementById("gaugeChart").getContext("2d");
const gaugeChart = new Chart(ctx, {
  type: "doughnut", // Use 'doughnut' for a gauge chart
  data: {
    labels: ["Progress"], // Label for the gauge
    datasets: [
      {
        data: [80], // Value representing the current progress (0-100)
        backgroundColor: "#4e73df", // Color of the gauge arc
        hoverBackgroundColor: "#2e59d9", // Hover color for the gauge arc
      },
    ],
  },
  options: {
    maintainAspectRatio: false, // Maintain aspect ratio for responsiveness
    cutoutPercentage: 80, // Set the cutout percentage for the gauge ring
    plugins: {
      gauge: {
        // Gauge plugin options
        arc: {
          lineWidth: 10, // Width of the gauge arc
          color: "#e3e6f0", // Color of the gauge arc background
        },
        text: {
          fontColor: "#858796", // Color of the gauge text
          fontSize: 20, // Font size for the gauge text
          fontStyle: "normal", // Font style for the gauge text
          position: "center", // Position of the gauge text
        },
      },
    },
  },
});
