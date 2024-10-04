import React, { useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable'; // Plugin for table rendering
import { Chart, registerables } from 'chart.js';
import { router } from '@inertiajs/react'; // Import Inertia

Chart.register(...registerables);

const RapportJournalierPage = ({ date }) => {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartInstanceRef1 = useRef(null);
  const chartInstanceRef2 = useRef(null);

  // Function to generate PDF and render text, chart, and tables
  const generatePdf = async () => {
    const doc = new jsPDF();

    // Add text sections
    doc.setFontSize(16);
    doc.text('Rapport Disciplinaire', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 105, 30, { align: 'center' });
    doc.text('Nombre des employés présent: 0', 10, 40);
    doc.text('Nombre des employés absent: 0', 10, 50);
    doc.text('Absentéisme total du jour: 0%', 10, 60);

    // Add title and first chart
    doc.setFontSize(14);
    doc.text('Taux d\'absentéisme', 10, 70);

    // Capture first chart with a delay to ensure it's fully rendered
    if (chartRef1.current) {
      const chartCanvas1 = chartRef1.current;
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay to ensure rendering

      const chartImage1 = await html2canvas(chartCanvas1, { useCORS: true, scale: 1 }).then(canvas => canvas.toDataURL('image/jpeg', 0.6));
      doc.addImage(chartImage1, 'JPEG', 10, 80, 180, 100); // Add chart 1 (adjust height)
    }

    // Add title and first table
    const firstTableY = 190;  // Dynamic Y position for first table after chart
    doc.text('Liste des employés absents', 10, firstTableY);

    // Add first table
    doc.autoTable({
      startY: firstTableY + 10,  // Ensure table starts after the first chart
      head: [['ID', 'Nom', 'Reason', 'Motif']],
      body: [
        [1, 'John Doe', 'Sick'],
        [2, 'Jane Smith', 'Vacation'],
        [3, 'Jim Brown', 'Personal'],
      ],
    });

    // Add title and second table
    const secondTableY = doc.autoTable.previous.finalY + 10;
    doc.text('Liste des questionnaires', 10, secondTableY);

    // Add second table
    doc.autoTable({
      startY: secondTableY + 10,
      head: [['ID', 'Nom', 'Sanction', 'Note']],
      body: [
        [1, 'Alice Green', '8'],
        [2, 'Bob White', '9'],
        [3, 'Charlie Blue', '7.5'],
      ],
    });

    // Add title and third table
    const thirdTableY = doc.autoTable.previous.finalY + 10;
    doc.text('Absence par département', 10, thirdTableY);

    // Add third table
    doc.autoTable({
      startY: thirdTableY + 10,
      head: [['Department', 'Present', 'Absent']],
      body: [
        ['Admin', 5, 2],
        ['Production', 20, 4],
        ['HR', 3, 0],
      ],
    });

    // Add title and second chart
    const secondChartY = doc.autoTable.previous.finalY + 20;
    doc.text('Absence:', 10, secondChartY);

    // Capture second chart
    if (chartRef2.current) {
      const chartCanvas2 = chartRef2.current;
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay to ensure rendering

      const chartImage2 = await html2canvas(chartCanvas2, { useCORS: true, scale: 1 }).then(canvas => canvas.toDataURL('image/jpeg', 1));
      doc.addImage(chartImage2, 'JPEG', 10, secondChartY + 10, 180, 100); // Add chart 2 with sufficient space
    }

    // Save the PDF
    doc.save(`Rapport-Journalier-${date}.pdf`);

    // Redirect back to the dashboard after the PDF is saved
    router.visit('/documentation');  // Use Inertia to navigate to the dashboard
  };

  // Initialize Chart.js for both charts
  useEffect(() => {
    const ctx1 = chartRef1.current.getContext('2d');
    const ctx2 = chartRef2.current.getContext('2d');

    if (chartInstanceRef1.current) {
      chartInstanceRef1.current.destroy();
    }
    if (chartInstanceRef2.current) {
      chartInstanceRef2.current.destroy();
    }

    chartInstanceRef1.current = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    chartInstanceRef2.current = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [15, 10, 13, 7, 9, 8],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
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
      if (chartInstanceRef1.current) chartInstanceRef1.current.destroy();
      if (chartInstanceRef2.current) chartInstanceRef2.current.destroy();
    };
  }, []);

  // Trigger the PDF generation on component mount
  useEffect(() => {
    generatePdf();
  }, []);

  return (
    <div style={{ display: 'block', marginTop: '20px', width: '20cm' }}>
      <div>
        <canvas ref={chartRef1} id="myBarChart" width="400" height="400"></canvas>
        <canvas ref={chartRef2} id="myLineChart" width="400" height="400"></canvas>
      </div>
    </div>
  );
};

export default RapportJournalierPage;
