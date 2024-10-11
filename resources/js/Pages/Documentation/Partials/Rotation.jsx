
import React, { useState } from 'react'; 
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { formatDate } from '@/utils/formatDate';
import { Link } from '@inertiajs/react';
export default function Rotation() {
    const [date, setDate] = useState(null);
    console.log(date);
    
    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );
    const footer = (
        <>
            <Link disabled={!date} href={route('gen.rapport.rotation', { monthYear: formatDate(date) })}>
                <Button label="Télécharger" icon="ti ti-download" disabled={!date} />
            </Link>
        </>
    );

    return (
        <div className="card flex justify-content-center p-4">
            <Card title="Rapport Rotation" subTitle="Ce rapport didiée à la rotation des employées" footer={footer} header={header} className="md:w-25rem dark:bg-slate-800 dark:text-white">
                <label>Choisir la date</label>
                <Calendar inputClassName="dark:bg-slate-600 dark:text-white" panelClassName="dark:bg-slate-600 dark:text-white" className='w-full dark:bg-slate-600' value={date} onChange={(e) => setDate(e.value)} view="year" dateFormat="yy"/>
            </Card>
        </div>
    )
}
        