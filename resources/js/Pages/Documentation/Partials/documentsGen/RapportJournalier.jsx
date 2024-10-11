import React, { useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable'; 
import { Chart, registerables } from 'chart.js';
import { router } from '@inertiajs/react'; 

Chart.register(...registerables);

const RapportJournalierPage = ({ date, departmentAttendanceData, numberOfEmployeesPresent, numberOfEmployeesAbsent,absentEmployees, questionnaires }) => {
  console.log(absentEmployees);
  
  const chartRef1 = useRef(null);
  const chartInstanceRef1 = useRef(null);

  const pdfGeneratedRef = useRef(false); 
  const generatePdf = async () => {
    if (pdfGeneratedRef.current) return;  
    pdfGeneratedRef.current = true;

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
      employee.reason || "",
    ]);
    doc.autoTable({
      startY: firstTableY + 10,
      head: [['ID', 'Nom', 'Reason']], 
      body: tableBody,
    });

    const secondTableY = doc.autoTable.previous.finalY + 10;
    doc.text('Liste des questionnaires', 10, secondTableY);
    const bodyData = questionnaires.map((q, index) => [
      index + 1, 
      q.employee.name, 
      q.sanctions.type_sanction, 
      q.description 
    ]);
    doc.autoTable({
      startY: secondTableY + 10,
      head: [['ID', 'Nom', 'Sanction', 'Note']],
      body: bodyData, 
    });

    const thirdTableY = doc.autoTable.previous.finalY + 10;
doc.text('Absence par département', 10, thirdTableY);

const thirdData = departmentAttendanceData.map((q, index) => [
  index + 1,           
  q.departement, 
  q.presentCount,
  q.absentCount, 
]);
console.log(thirdData)

doc.autoTable({
  startY: thirdTableY + 10,
  head: [['#', 'Departement', 'Present', 'Absent']],
  body: thirdData,
});

   

    doc.save(`Rapport-Journalier-${date}.pdf`);

    router.visit('/documentation');  
  };

  useEffect(() => {
    const ctx1 = chartRef1.current.getContext('2d');

    if (chartInstanceRef1.current) {
      chartInstanceRef1.current.destroy();
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


    return () => {
      if (chartInstanceRef1.current) chartInstanceRef1.current.destroy();
    };
  }, []);

  useEffect(() => {
    generatePdf();
  }, []);

  return (
    <div style={{ display: 'block', marginTop: '20px', width: '20cm' }}>
      <div>
        <canvas ref={chartRef1} id="myBarChart" width="400" height="500"></canvas>
      </div>
    </div>
  );
};

export default RapportJournalierPage;
