import React, { useState, useRef } from 'react'; 
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

import RapportJournalierPage from './documentsGen/RapportJournalier';
import { Link } from '@inertiajs/react';
import { formatDate } from '@/utils/formatDate';

export default function RapportJournalier() {
    const [date, setDate] = useState(null);
    
    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );
    const footer = (
        <>
            <Link disabled={!date} href={route('gen.rapport.journalier', { dateQuery: formatDate(date) })}>
                <Button label="Télécharger" icon="ti ti-download" disabled={!date} />
            </Link>
        </>
    );

    return (
        <div className="card flex justify-content-center p-4">
            <Card title="Rapport Journalier" subTitle="Ce rapport est dédié à l'absentéisme des employées dans un mois exact" footer={footer} header={header} className="md:w-25rem dark:bg-slate-800 dark:text-white">
                <label>Choisir la date</label>
                <Calendar inputClassName="dark:bg-slate-600 dark:text-white" panelClassName="dark:bg-slate-600 dark:text-white" className='w-full dark:bg-slate-600' value={date} onChange={(e) => setDate(e.value)} />
            </Card>
        </div>
    );
}
