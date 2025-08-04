import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ProductivityChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'],
                datasets: [{
                    label: 'Tugas Selesai',
                    data: [12, 19, 25, 22, 30, 28, 35, 40],
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
                    legend: { display: false }
                }
            }
        });
        return () => chart.destroy(); // Cleanup chart on component unmount
    }, []);

    return <canvas ref={chartRef}></canvas>;
};

export default ProductivityChart;
