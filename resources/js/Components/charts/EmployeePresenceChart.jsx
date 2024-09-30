import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Calendar } from 'primereact/calendar';
// import { Dropdown } from 'primereact/dropdown';
import { transformDateFormat } from '@/utils/transformDate';

export default function EmployeePresenceChart({ data, departments }) {
    const changeDate=(d)=> {
        const date = new Date(d)
        const formattedDate = date.toLocaleDateString('en-GB');

        return formattedDate;
    }
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formatDate, setFormatDate] = useState(transformDateFormat(changeDate(selectedDate)))
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    
    const handleCalendar = (e) => {
        setSelectedDate(e.value)
        setFormatDate(transformDateFormat(changeDate(e.value)));
    }
    // Helper function to count employees by status (present or absent) per department
    const countEmployeesByDepartment = (date) => {
        const presentCount = {};
        const absentCount = {};

        departments.forEach((dep) => {
            presentCount[dep.id] = 0;
            absentCount[dep.id] = 0;
        });

        data.forEach((record) => {
            const { employee, presence_data } = record;
            const presenceDataParsed = JSON.parse(presence_data);
            const presenceStatus = presenceDataParsed[date]?.status;

            if (presenceStatus !== undefined) {
                const departmentId = employee.id_departement;
                if (presenceStatus === 1) {
                    // Present
                    presentCount[departmentId]++;
                } else {
                    // Absent
                    absentCount[departmentId]++;
                }
            }
        });

        return { presentCount, absentCount };
    };

    useEffect(() => {
        const { presentCount, absentCount } = countEmployeesByDepartment(formatDate);

        const departmentLabels = departments.map(dep => dep.nom_departement);
        const presentData = departments.map(dep => presentCount[dep.id] || 0);
        const absentData = departments.map(dep => absentCount[dep.id] || 0);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const data = {
            labels: departmentLabels,
            datasets: [
                {
                    label: 'Present',
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    backgroundColor: documentStyle.getPropertyValue('--blue-200'),
                    fill: false,
                    data: presentData,
                    type: "bar",
                },
                {
                    label: 'Absent',
                    borderColor: documentStyle.getPropertyValue('--red-500'),
                    backgroundColor: documentStyle.getPropertyValue('--red-200'),
                    fill: false,
                    data: absentData,
                    type:"bar",
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [formatDate, data, departments]);

    // Function to get unique dates from the data for the dropdown
    const getUniqueDates = () => {
        const datesSet = new Set();
        data.forEach(record => {
            const presenceDataParsed = JSON.parse(record.presence_data);
            Object.keys(presenceDataParsed).forEach(date => datesSet.add(date));
        });
        return Array.from(datesSet);
    };

    const uniqueDates = getUniqueDates();
    console.log(uniqueDates);
    
    
    return (
        <div className="card">
           
            <div className="flex justify-between items-center">
                <h3 className='text-lg font-bold'>Absentiesme</h3>
                <Calendar value={selectedDate} onChange={(e) => handleCalendar(e)}  />
            </div>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    );
}
