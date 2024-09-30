import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { calculateAge, groupByAgeAndGender } from '../../utils/ageUtils'
export default function AgeGender({ employees }) { // Pass employees data as props
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Group employees by age range and gender
        const ageGenderData = groupByAgeAndGender(employees);

        // Update chart data
        const data = {
            labels: ['18-25', '26-35', '36-45', '46+'],
            datasets: [
                {
                    label: 'Homme',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [
                        ageGenderData.Homme['18-25'], 
                        ageGenderData.Homme['26-35'], 
                        ageGenderData.Homme['36-45'], 
                        ageGenderData.Homme['46+']
                    ]
                },
                {
                    label: 'Femme',
                    backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: [
                        ageGenderData.Femme['18-25'], 
                        ageGenderData.Femme['26-35'], 
                        ageGenderData.Femme['36-45'], 
                        ageGenderData.Femme['46+']
                    ]
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [employees]); // Rerun if employee data changes

    return (
        <div className="card">
             <h3 className='text-lg font-bold'>Employées dépend l'âge</h3>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    );
}
