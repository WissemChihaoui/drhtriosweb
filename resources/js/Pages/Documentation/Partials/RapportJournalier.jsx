import React, { useState, useEffect, useRef } from 'react'; 
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Chart, BarElement, CategoryScale, LinearScale, Title } from 'chart.js';  // Import the necessary components

// Register the components for Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Title);

export default function RapportJournalier() {
    const [date, setDate] = useState(null);
    const chartRef = useRef(null);  // Reference to the chart container

    // Generate chart in the canvas element
    useEffect(() => {
        if (chartRef.current) {
            new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: ['Present', 'Absent'],
                    datasets: [{
                        label: 'Employee Attendance',
                        data: [10, 5],  // Example data
                        backgroundColor: ['#36A2EB', '#FF6384'],
                    }]
                }
            });
        }
    }, []);

    // Generate PDF
    const generatePdf = async () => {
        const doc = new jsPDF();

        // Add title and date
        doc.setFontSize(16);
        doc.text('Rapport Journalier', 10, 10);
        doc.setFontSize(12);
        doc.text(`Date: ${date ? date.toLocaleDateString() : 'Non sélectionnée'}`, 10, 20);

        // Add table (Absence by department example)
        doc.autoTable({
            startY: 30,
            head: [['Department', 'Present', 'Absent']],
            body: [
                ['ADMINISTRATION', 5, 2],
                ['BUREAU D\'ETUDE', 3, 0],
                // Add other rows
            ],
        });

        // Convert chart to image and embed it
        const chartCanvas = chartRef.current;
        const chartImage = await html2canvas(chartCanvas).then(canvas => canvas.toDataURL('image/png'));
        doc.addImage(chartImage, 'PNG', 10, 60, 180, 90);  // Adjust position and size

        // Save the PDF
        doc.save(`Rapport-Journalier-${date ? date.toLocaleDateString() : 'sans-date'}.pdf`);
    };

    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );
    const footer = (
        <>
            <Button label="Télécharger" icon="ti ti-download" disabled={!date} onClick={generatePdf}/>
        </>
    );

    return (
        <div className="card flex justify-content-center p-4">
            <Card title="Rapport Journalier" subTitle="Ce rapport est dédié à la présence des employées dans un jour exact" footer={footer} header={header} className="md:w-25rem dark:bg-slate-800 dark:text-white">
                <label>Choisir la date</label>
                <Calendar inputClassName="dark:bg-slate-600 dark:text-white" panelClassName="dark:bg-slate-600 dark:text-white" className='w-full dark:bg-slate-600' value={date} onChange={(e) => setDate(e.value)}/>
                
                {/* Chart Canvas */}
                <div className="chart-container" style={{ position: 'relative', height: '200px', width: '400px' }}>
                    <canvas ref={chartRef}></canvas>
                </div>
            </Card>
        </div>
    );
}
