import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function CategoriesGender({ employees, categories }) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    // Function to group employees by category and gender
    function groupByCategoryAndGender(employees, categories) {
        const categoryGenderData = categories.reduce((acc, category) => {
            acc[category.name] = {
                Homme: 0,
                Femme: 0
            };
            return acc;
        }, {});

        employees.forEach(employee => {
            const category = categories.find(cat => cat.id === employee.category_id);
            if (category) {
                categoryGenderData[category.name][employee.gender]++;
            }
        });

        return categoryGenderData;
    }

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Group employees by category and gender
        const categoryGenderData = groupByCategoryAndGender(employees, categories);

        const labels = categories.map(categorie => categorie.name); // Category names for the X-axis
        const hommeData = labels.map(label => categoryGenderData[label].Homme); // Number of males in each category
        const femmeData = labels.map(label => categoryGenderData[label].Femme); // Number of females in each category

        const data = {
            labels, // Use category names as labels
            datasets: [
                {
                    label: 'Homme',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: hommeData // Data for males
                },
                {
                    label: 'Femme',
                    backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: femmeData // Data for females
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
    }, [employees, categories]); // Recalculate when employees or categories change

    return (
        <div className="card">
            <h3 className='text-lg font-bold'>Employées Dépend les catégories</h3>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    );
}
