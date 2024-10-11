import React from 'react'; 
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function FormatEmp() {
    const handleDownload = () => {
        // Specify the path to your CSV file
        const fileUrl = '/format.csv'; // Adjust this path as needed
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', 'example.csv'); // Set the name for the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up by removing the link
    };

    const footer = (
        <>
            <Button label="Télécharger" icon="ti ti-download" onClick={handleDownload} />
        </>
    );

    return (
        <div className="card flex justify-content-center p-4">
            <Card 
                title="Format CSV" 
                subTitle="Télécharger un fichier csv d'exemple pour importer des employés" 
                footer={footer} 
                className="md:w-25rem dark:bg-slate-800 dark:text-white"
            />
        </div>
    );
}