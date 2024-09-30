import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import '../css/Analytics.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [monthlyTurnosData, setMonthlyTurnosData] = useState([]);
    const [monthlyPacientesData, setMonthlyPacientesData] = useState([]);

    useEffect(() => {
        // Obtener los datos mensuales de pacientes
        const fetchMonthlyPacientesData = async () => {
            try {
                const response = await fetch(`${API_URL}/pacientes/monthly`);
                const data = await response.json();
                setMonthlyPacientesData(data);
            } catch (error) {
                console.error('Error al obtener la cantidad de pacientes mensuales:', error);
            }
        };

        // Obtener los datos mensuales de turnos
        const fetchMonthlyTurnosData = async () => {
            try {
                const response = await fetch(`${API_URL}/turnos/monthly`);
                const data = await response.json();
                setMonthlyTurnosData(data);
            } catch (error) {
                console.error('Error al obtener los datos mensuales de turnos:', error);
            }
        };

        fetchMonthlyPacientesData();
        fetchMonthlyTurnosData();
    }, []);

    // Preparar los datos para el gráfico de pacientes registrados mensualmente
    const pacienteChartData = {
        labels: monthlyPacientesData.map(item => `${item._id.month}/${item._id.year}`),
        datasets: [
            {
                label: 'Pacientes Mensuales',
                data: monthlyPacientesData.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Preparar los datos para el gráfico de turnos mensuales
    const turnosChartData = {
        labels: monthlyTurnosData.map(item => `${item._id.month}/${item._id.year}`),
        datasets: [
            {
                label: 'Turnos Mensuales',
                data: monthlyTurnosData.map(item => item.count),
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="analyticsScreen">
            <div className="displayAnalytic">
                <h1>Analytics</h1>
                <div className="charts-row">
                    <div className="chart-container">
                        <h2>Pacientes Registrados Mensualmente</h2>
                        <Bar data={pacienteChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                    <div className="chart-container">
                        <h2>Turnos Registrados Mensualmente</h2>
                        <Line data={turnosChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
