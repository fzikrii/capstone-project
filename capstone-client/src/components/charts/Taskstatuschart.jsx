import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TaskStatusChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['To Do', 'Ongoing', 'Done', 'Stuck'],
                datasets: [{
                    data: [35, 45, 15, 5],
                    backgroundColor: ['#38bdf8', '#f59e0b', '#22c55e', '#f43f5e'],
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
        return () => chart.destroy(); // Cleanup chart on component unmount
    }, []);

    return <canvas ref={chartRef}></canvas>;
};

export default TaskStatusChart;
