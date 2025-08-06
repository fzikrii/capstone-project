import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// This component now accepts a 'data' prop
const ProductivityChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        // If there's no data or the canvas isn't ready, do nothing
        if (!chartRef.current || !data || data.length === 0) {
            return;
        }

        // --- Data Transformation ---
        // The data is already in the correct format from our backend processing
        const labels = data.map(item => item.date); // e.g., ['2025-08-01', '2025-08-02', ...]
        const counts = data.map(item => item.count); // e.g., [0, 5, ...]

        const ctx = chartRef.current.getContext('2d');

        // Destroy the previous chart instance if it exists
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Create the new chart with dynamic data
        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, // Use dynamic date labels
                datasets: [{
                    label: 'Tasks Completed', // Updated label
                    data: counts, // Use dynamic task counts
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: true, position: 'top' } // It's good to show the legend
                }
            }
        });

    }, [data]); // The effect depends on the 'data' prop

    // Display a message if no data is available
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-slate-500">No productivity data to display.</div>;
    }

    return <canvas ref={chartRef}></canvas>;
};
 
export default ProductivityChart;