import React, { useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import html2canvas from 'html2canvas';
import { router } from '@inertiajs/react'; 
const RotationRapport = ({ monthYear,employeesLeft, employeesJoined }) => {
  const pdfGeneratedRef = useRef(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Register necessary components
  Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

  const generatePdf = async () => {
    if (pdfGeneratedRef.current) return;  
    pdfGeneratedRef.current = true;

    const doc = new jsPDF();

    // Set up the title
    doc.setFontSize(16);
    doc.text('Rapport de Rotation', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${monthYear}`, 105, 30, { align: 'center' });

    // Define the months
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Create table data
    const tableBody = months.map((month, index) => [
      month,
      employeesJoined[index + 1] || 0,
      employeesLeft[index + 1] || 0,
    ]);

    // Add title for the table
    doc.setFontSize(12);
    doc.text('Résumé des Entrées et Sorties des Employés', 10, 45);

    // Generate the table
    doc.autoTable({
      startY: 50,
      head: [['Mois', 'Employée Entrée', 'Employée Sortie']],
      body: tableBody,
    });

    try {
      // Wait for the chart to be rendered before capturing it
      await new Promise((resolve) => setTimeout(resolve, 500)); 

      // Generate chart as image
      const canvas = await html2canvas(chartRef.current,{ useCORS: true, scale: 1 });
      
      // Ensure canvas is captured correctly
      const imgData = canvas.toDataURL('image/png');
      
      // Add chart image to PDF
      doc.addImage(imgData, 'PNG', 10, doc.autoTable.previous.finalY + 10, 190, 100);
      
      // Save the generated PDF
      doc.save(`Rapport_de_rotation_${monthYear}.pdf`);
      router.visit('/documentation'); 
      console.log("PDF generated successfully.");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  useEffect(() => {
    generateChart(); 
    generatePdf();   
  }, []);

  const generateChart = () => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Convert object values to arrays
    const joinedValues = Object.values(employeesJoined);
    const leftValues = Object.values(employeesLeft);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Employés Entrés',
            data: joinedValues.slice(1),
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          },
          {
            label: 'Employés Sortis',
            data: leftValues.slice(1),
            borderColor: 'rgba(255,99,132,1)',
            fill: false,
          }
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { 
            beginAtZero: true,
          },
          x: { 
            title: {
              display: true,
              text: "Months"
            }
          }
        },
      },
    });
  };

  return (
    <div style={{ display: 'block', marginTop: '20px', width: '20cm' }}>
      <h2>Rapport de Rotation</h2>
      <canvas ref={chartRef} width="400" height="200" />
      <p>The PDF has been generated. Check your downloads.</p>
    </div>
  );
};

export default RotationRapport;