import React, { useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import { router } from '@inertiajs/react'; 

Chart.register(...registerables);

const EmployeeStatisticsReport = ({ date, employeeData, absenceData }) => {
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const chartRef3 = useRef(null); // Ref for absence chart
    const chartInstanceRef1 = useRef(null);
    const chartInstanceRef2 = useRef(null);
    const chartInstanceRefAbsence = useRef(null); // Ref for absence chart instance
    const pdfGeneratedRef = useRef(false); 
    console.log(absenceData);
    
    const calculateAbsencePercentages = (absenceData) => {
        const absencePercentages = absenceData.map(({ department, absencePercentage }) => ({
            department,
            absencePercentage,
        }));
        return absencePercentages;
    };

    const absencePercentages = calculateAbsencePercentages(absenceData);

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
    
        if (chartRef1.current) {
            const chartCanvas1 = chartRef1.current;
            await new Promise((resolve) => setTimeout(resolve, 500));
    
            const chartImage1 = await html2canvas(chartCanvas1, { useCORS: true, scale: 1 })
                .then(canvas => canvas.toDataURL('image/jpeg', 0.6));
            doc.addImage(chartImage1, 'JPEG', 10, 70, 180, 100); // Adjust position and size
        }
    
        if (chartRef2.current) {
            const chartCanvas2 = chartRef2.current;
            await new Promise((resolve) => setTimeout(resolve, 500));
    
            const chartImage2 = await html2canvas(chartCanvas2, { useCORS: true, scale: 1 })
                .then(canvas => canvas.toDataURL('image/jpeg', 0.6));
            doc.addImage(chartImage2, 'JPEG', 50, 180, 100, 100, { align: 'center' });
        }
    
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
        
    
        const absenceChartImage = await html2canvas(chartRef3.current, { useCORS: true, scale: 1 })
            .then(canvas => canvas.toDataURL('image/jpeg', 0.6));
        doc.addImage(absenceChartImage, 'JPEG', 10, doc.lastAutoTable.finalY + 20, 180, 100);
        doc.text('Absenteisme de ce mois', 10, doc.lastAutoTable.finalY + 15);
        doc.autoTable({
            startY: 280,
            head: [['#','Département', 'Taux d\'absence']],
            body: absenceData.map((q,i)=>[
                i+1,
                q.department,
                '%'+(q.absencePercentage).toFixed(2)
            ]),
        });
        doc.save(`Rapport-Statistiques-${date}.pdf`);
        router.visit('/documentation');
    };

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
        const ctxAbsence = chartRef3.current.getContext('2d');

        if (chartInstanceRefAbsence.current) {
            chartInstanceRefAbsence.current.destroy();
        }

        const departments = absencePercentages.map(item => item.department);
        const absenceValues = absencePercentages.map(item => item.absencePercentage);

        chartInstanceRefAbsence.current = new Chart(ctxAbsence, {
            type: 'bar',
            data: {
                labels: departments,
                datasets: [{
                    label: 'Taux d\'absence (%)',
                    data: absenceValues,
                    backgroundColor: 'rgba(255, 206, 86, 0.6)',
                }],
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });

        return () => {
            if (chartInstanceRefAbsence.current) chartInstanceRefAbsence.current.destroy();
        };
    }, [absenceData]); // Re-run when absenceData changes

    useEffect(() => {
        generatePdf();
    }, []);

    return (
        <div style={{ display: 'block', marginTop: '20px', width: '20cm' }}>
            <div>
                <canvas ref={chartRef1} id="myBarChart" width="400" height="600"></canvas>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <canvas ref={chartRef2} id="totalGender" width="400" height="400"></canvas>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <canvas ref={chartRef3} id="absenceChart" width="400" height="400"></canvas>
            </div>
        </div>
    );
};

export default EmployeeStatisticsReport;
