import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// This component now accepts a 'data' prop
const TaskStatusChart = ({ data }) => {
    const chartRef = useRef(null);
    // We use a separate ref to hold the chart instance to prevent re-renders
    const chartInstanceRef = useRef(null);

    // This effect hook will run whenever the 'data' prop changes
    useEffect(() => {
        // If there's no data or the canvas isn't ready, do nothing
        if (!chartRef.current || !data || data.length === 0) {
            return;
        }

        // --- Data Transformation ---
        // We create arrays for labels and counts from our data prop
        const labels = data.map(item => item._id); // e.g., ['Done', 'Ongoing', 'ToDo']
        const counts = data.map(item => item.count); // e.g., [18, 5, 12]

        // Create a consistent color map for statuses
        const statusColors = {
            'ToDo': '#38bdf8',      // sky-400
            'Ongoing': '#f59e0b',   // amber-500
            'Done': '#22c55e',      // emerald-500
            'Stuck': '#f43f5e',     // rose-500
            'Default': '#a8a29e'    // stone-400
        };

        // Map the labels to our color map to ensure 'Done' is always green, etc.
        const backgroundColors = labels.map(label => statusColors[label] || statusColors.Default);

        const ctx = chartRef.current.getContext('2d');
        
        // Destroy the previous chart instance if it exists
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Create the new chart with dynamic data
        chartInstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels, // Use dynamic labels
                datasets: [{
                    data: counts, // Use dynamic counts
                    backgroundColor: backgroundColors, // Use dynamic colors
                    borderColor: '#ffffff',
                    borderWidth: 4,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' }
                    }
                }
            }
        });

        // The cleanup function is implicitly handled by destroying the chart at the start of the effect
    }, [data]); // The effect depends on the 'data' prop

    // Display a message if no data is available
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-slate-500">No task status data found.</div>;
    }

    return <canvas ref={chartRef}></canvas>;
};

export default TaskStatusChart;