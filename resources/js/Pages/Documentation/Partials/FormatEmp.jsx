
import React, { useState } from 'react'; 
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

export default function FormatEmp() {
    
    const footer = (
        <>
            <Button label="Télécharger" icon="ti ti-download" />
        </>
    );

    return (
        <div className="card flex justify-content-center p-4">
            <Card title="Format CSV" subTitle="Télécharger un fichier csv d'exmple pour importer des employées" footer={footer} className="md:w-25rem dark:bg-slate-800 dark:text-white"></Card>
        </div>
    )
}
        