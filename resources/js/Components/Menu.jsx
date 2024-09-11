
import React from 'react';
import { MegaMenu } from 'primereact/megamenu';
import { InputText } from 'primereact/inputtext';
import { Ripple } from 'primereact/ripple';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import ApplicationLogo from './ApplicationLogo';

export default function Menu() {
    const itemRenderer = (item, options) => {
        if (item.root) {
            return (
                <a className="flex align-items-center cursor-pointer px-3 py-2 overflow-hidden relative font-semibold text-lg uppercase p-ripple hover:surface-ground" style={{ borderRadius: '2rem' }} onClick={(e) => options.onClick(e)}>
                    <span className="text-base">{item.label}</span>
                    <Ripple />
                </a>
            );
        } else if (!item.image) {
            return (
                <a className="flex align-items-center p-3 cursor-pointer mb-2 gap-2 " onClick={options.onClick}>
                    <span className="inline-flex flex-column gap-1">
                        <span className="font-medium text-base text-900">{item.label}</span>
                    </span>
                </a>
            );
        } else {
            return (
                <div className="flex flex-column align-items-start gap-3" onClick={options.onClick}>
                    <img alt="megamenu-demo" src={item.image} className="w-full" />
                    <span>{item.subtext}</span>
                    <Button className="p-button p-component p-button-outlined" label={item.label} />
                </div>
            );
        }
    };

    const items = [
        {
            label: 'Tableau de bord',
            root: true,
            template: itemRenderer,
            items: [
                [
                    {
                        items: [
                            { label: 'Features', icon: 'pi pi-list', subtext: 'Subtext of item', template: itemRenderer },
                            { label: 'Customers', icon: 'pi pi-users', subtext: 'Subtext of item', template: itemRenderer },
                            { label: 'Case Studies', icon: 'pi pi-file', subtext: 'Subtext of item', template: itemRenderer }
                        ]
                    }
                ]
            ]
        },
        {
            label: 'Liste des employés',
            root: true,
            template: itemRenderer
        },
        {
            label: 'Présence',
            root: true,
            template: itemRenderer
        },
        {
            label: 'Les absents',
            root: true,
            template: itemRenderer
        },
        {
            label: 'Absentiesme',
            root: true,
            template: itemRenderer
        },
        {
            label: 'Département',
            root: true,
            template: itemRenderer
        },
        {
            label: 'Questionnaire',
            root: true,
            template: itemRenderer
        },
        {
            label: 'Polyvalence',
            root: true,
            template: itemRenderer
        },
        {
            label: 'Dépense',
            root: true,
            template: itemRenderer
        },
    ];

    const start = (
        <ApplicationLogo width='100' className="mr-4"/>
    );
    const end = <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" className=''/>;

    return (
            <MegaMenu model={items} orientation="vertical" start={start} end={end} breakpoint="960px" className="p-3 surface-0 shadow-2 w-max border-0 min-h-screen gap-4"/>
    )
}
        