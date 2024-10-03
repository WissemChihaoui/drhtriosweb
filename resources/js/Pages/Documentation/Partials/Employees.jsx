
import React, { useState, useRef } from 'react'; 
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Menu } from 'primereact/menu';

export default function Employees() {
    const menuLeft = useRef(null);
    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'CSV',
                    icon: 'ti ti-csv'
                },
                {
                    label: 'PDF',
                    icon: 'ti ti-pdf'
                }
            ]
        }
    ];
    const footer = (
        <>
            <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
            <Button label="Télécharger" icon="ti ti-download" className="mr-2" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup />
        </>
    );

    return (
        <div className="card flex justify-content-center p-4 ">
            <Card title="Les employées" subTitle="Télécharger liste des employées, veuillez choisir le type de fichier" footer={footer} className="md:w-25rem dark:bg-slate-800 dark:text-white w-full h-full"></Card>
        </div>
    )
}
        