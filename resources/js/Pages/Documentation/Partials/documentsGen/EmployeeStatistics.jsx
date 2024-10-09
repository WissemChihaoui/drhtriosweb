import React, { useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import { router } from '@inertiajs/react'; 

Chart.register(...registerables);

const EmployeeStatisticsReport = ({ date, employeeData }) => {
    console.log(employeeData);

    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const chartInstanceRef1 = useRef(null);
    const chartInstanceRef2 = useRef(null); // For pie chart
    const pdfGeneratedRef = useRef(false); // Prevent multiple PDF generations

    const generatePdf = async () => {
        if (pdfGeneratedRef.current) return; // Prevent running the function twice
        pdfGeneratedRef.current = true; // Mark PDF as generated

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Rapport de Statistiques des Employés', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Date: ${date}`, 105, 30, { align: 'center' });

        const { Homme, Femme } = employeeData;

        const totalEmployees = Homme['18-25'] + Homme['26-35'] + Homme['36-45'] + Homme['46+'] +
                               Femme['18-25'] + Femme['26-35'] + Femme['36-45'] + Femme['46+'];

        doc.text(`Total Employés: ${totalEmployees}`, 10, 40);
        doc.text(`Nombre d'Hommes: ${Homme['18-25'] + Homme['26-35'] + Homme['36-45'] + Homme['46+']}`, 10, 50);
        doc.text(`Nombre de Femmes: ${Femme['18-25'] + Femme['26-35'] + Femme['36-45'] + Femme['46+']}`, 10, 60);

        // Add chart image (Bar chart)
        if (chartRef1.current) {
            const chartCanvas1 = chartRef1.current;
            await new Promise((resolve) => setTimeout(resolve, 500));

            const chartImage1 = await html2canvas(chartCanvas1, { useCORS: true, scale: 1 })
                .then(canvas => canvas.toDataURL('image/jpeg', 0.6));
            doc.addImage(chartImage1, 'JPEG', 10, 70, 180, 100); // Adjust position and size
        }

        // Add chart image (Pie chart)
        if (chartRef2.current) {
            const chartCanvas2 = chartRef2.current;
            await new Promise((resolve) => setTimeout(resolve, 500));

            const chartImage2 = await html2canvas(chartCanvas2, { useCORS: true, scale: 1 })
                .then(canvas => canvas.toDataURL('image/jpeg', 0.6));
            doc.addImage(chartImage2, 'JPEG', 10, 180, 100, 100); // Adjust position and size
        }

        // Create a table for age categories
        const tableBody = [
            ['18-25', Homme['18-25'], Femme['18-25']],
            ['26-35', Homme['26-35'], Femme['26-35']],
            ['36-45', Homme['36-45'], Femme['36-45']],
            ['46+', Homme['46+'], Femme['46+']],
        ];

        doc.autoTable({
            startY: 280,
            head: [['Catégorie d\'âge', 'Homme', 'Femme']],
            body: tableBody,
        });

        doc.save(`Rapport-Statistiques-${date}.pdf`);
        router.visit('/documentation'); // Redirect after PDF generation
    };

    // Bar chart (already existing)
    useEffect(() => {
        const ctx1 = chartRef1.current.getContext('2d');

        if (chartInstanceRef1.current) {
            chartInstanceRef1.current.destroy();
        }

        const ageCategories = ['18-25', '26-35', '36-45', '46+'];
        const hommeData = ageCategories.map(category => employeeData.Homme[category]);
        const femmeData = ageCategories.map(category => employeeData.Femme[category]);

        chartInstanceRef1.current = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ageCategories,
                datasets: [
                    {
                        label: "Homme",
                        data: hommeData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                    {
                        label: "Femme",
                        data: femmeData,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });

        return () => {
            if (chartInstanceRef1.current) chartInstanceRef1.current.destroy();
        };
    }, [employeeData]);

    // Pie chart for total Homme/Femme
    useEffect(() => {
        const ctx2 = chartRef2.current.getContext('2d');

        if (chartInstanceRef2.current) {
            chartInstanceRef2.current.destroy();
        }

        const totalHomme = Object.values(employeeData.Homme).reduce((sum, value) => sum + value, 0);
        const totalFemme = Object.values(employeeData.Femme).reduce((sum, value) => sum + value, 0);

        chartInstanceRef2.current = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: ['Homme', 'Femme'],
                datasets: [
                    {
                        data: [totalHomme, totalFemme],
                        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                    },
                ],
            },
            options: {
                responsive: true,
            },
        });

        return () => {
            if (chartInstanceRef2.current) chartInstanceRef2.current.destroy();
        };
    }, [employeeData]);

    useEffect(() => {
        generatePdf();
    }, []);

    return (
        <div style={{ display: 'block', marginTop: '20px', width: '20cm' }}>
            <div>
                <canvas ref={chartRef1} id="myBarChart" width="400" height="600"></canvas>
                <canvas ref={chartRef2} id="totalGender" width="400" height="400"></canvas>
            </div>
        </div>
    );
};

export default EmployeeStatisticsReport;
