import React, { useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable'; 
import { Chart, registerables } from 'chart.js';
import { router } from '@inertiajs/react'; 

Chart.register(...registerables);

const RapportJournalierPage = ({ date, departmentAttendanceData, numberOfEmployeesPresent, numberOfEmployeesAbsent,absentEmployees, questionnaires }) => {
  console.log(questionnaires);
  
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartInstanceRef1 = useRef(null);
  const chartInstanceRef2 = useRef(null);

  const pdfGeneratedRef = useRef(false);  // Using useRef to track PDF generation

  const generatePdf = async () => {
    if (pdfGeneratedRef.current) return;  // Prevent running the function twice
    pdfGeneratedRef.current = true;       // Mark PDF as generated

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Rapport Disciplinaire', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 105, 30, { align: 'center' });
    doc.text(`Nombre des employés présent: ${numberOfEmployeesPresent}`, 10, 40);
    doc.text(`Nombre des employés absent: ${numberOfEmployeesAbsent}`, 10, 50);
    
    const totalEmployees = numberOfEmployeesAbsent + numberOfEmployeesPresent;
    const absenteeismPercentage = totalEmployees > 0 
      ? ((numberOfEmployeesAbsent * 100) / totalEmployees).toFixed(2)
      : '0'; 
    
    doc.text(`Absentéisme total du jour: ${absenteeismPercentage}%`, 10, 60);
    

    doc.setFontSize(14);
    doc.text('Taux d\'absentéisme', 10, 70);

    if (chartRef1.current) {
      const chartCanvas1 = chartRef1.current;
      await new Promise((resolve) => setTimeout(resolve, 500));

      const chartImage1 = await html2canvas(chartCanvas1, { useCORS: true, scale: 1 }).then(canvas => canvas.toDataURL('image/jpeg', 0.6));
      doc.addImage(chartImage1, 'JPEG', 10, 80, 180, 100); 
    }

    const firstTableY = 190;  
    doc.text('Liste des employés absents', 10, firstTableY);
    const tableBody = absentEmployees.map((employee) => [
      employee.employee_id,
      employee.employee_name,
      employee.reason || "No reason provided", // Default to 'No reason provided' if reason is null
    ]);
    doc.autoTable({
      startY: firstTableY + 10,
      head: [['ID', 'Nom', 'Reason']], // Table header
      body: tableBody, // Parsed data from absentEmployees
    });

    const secondTableY = doc.autoTable.previous.finalY + 10;
    doc.text('Liste des questionnaires', 10, secondTableY);

    doc.autoTable({
      startY: secondTableY + 10,
      head: [['ID', 'Nom', 'Sanction', 'Note']],
      body: [
        [1, 'Alice Green', '8'],
        [2, 'Bob White', '9'],
        [3, 'Charlie Blue', '7.5'],
      ],
    });

    const thirdTableY = doc.autoTable.previous.finalY + 10;
    doc.text('Absence par département', 10, thirdTableY);

    doc.autoTable({
      startY: thirdTableY + 10,
      head: [['Department', 'Present', 'Absent']],
      body: [
        ['Admin', 5, 2],
        ['Production', 20, 4],
        ['HR', 3, 0],
      ],
    });

    const secondChartY = doc.autoTable.previous.finalY + 20;
    doc.text('Absence:', 10, secondChartY);

    if (chartRef2.current) {
      const chartCanvas2 = chartRef2.current;
      await new Promise((resolve) => setTimeout(resolve, 500));

      const chartImage2 = await html2canvas(chartCanvas2, { useCORS: true, scale: 1 }).then(canvas => canvas.toDataURL('image/jpeg', 1));
      doc.addImage(chartImage2, 'JPEG', 10, secondChartY + 10, 180, 100);
    }

    doc.save(`Rapport-Journalier-${date}.pdf`);

    router.visit('/documentation');  
  };

  useEffect(() => {
    const ctx1 = chartRef1.current.getContext('2d');
    const ctx2 = chartRef2.current.getContext('2d');

    if (chartInstanceRef1.current) {
      chartInstanceRef1.current.destroy();
    }
    if (chartInstanceRef2.current) {
      chartInstanceRef2.current.destroy();
    }
    const departmentNames = departmentAttendanceData.map(dept => dept.departement);
    const percentageAbsent = departmentAttendanceData.map(dept => dept.percentageAbsent);
    chartInstanceRef1.current = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: departmentNames,
        datasets: [{
          label: "Percentage d'absence",
          data: percentageAbsent,
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)'],
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
