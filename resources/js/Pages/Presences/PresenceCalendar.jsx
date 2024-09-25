import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CalendarData from './Calendar/CalendarData';
import { Dropdown } from 'primereact/dropdown';
import { usePage, router  } from '@inertiajs/react';

const PresenceCalendar = ({ auth, presences, employees }) => {
    const { url } = usePage();
    const id = url.split('/').pop();
    
    // Set initial state with the selected employee ID
    const [selectedEmployee, setSelectedEmployee] = useState(id);
    console.log(presences);
    
    // Flatten all presence data from multiple months
    const allPresenceData = presences.map((presence) => ({
        month: presence.month,
        presence_data: JSON.parse(presence.presence_data),
    }));

    const handleChangeEmployee = (e) => {
        setSelectedEmployee(e.value);
        // Navigate to the new employee's presence page
        router.visit(route('calendar.index', {id: e.value}));
    };

    return (
        <AuthenticatedLayout auth={auth} header={'Présence Mensuelle'}>
            <div className="grid grid-cols-5">
                <div className='col-span-2 p-2'>
                    <div className="card">
                        <Dropdown 
                            value={selectedEmployee} 
                            onChange={handleChangeEmployee} 
                            options={employees} 
                            optionValue='id' 
                            optionLabel="name" 
                            placeholder="Select an Employee" 
                            filter  
                            className="w-full md:w-14rem" 
                        />
                    </div>   
                </div>
                <div className="col-span-3 p-2">
                    <CalendarData initial={presences[0].month} allPresenceData={allPresenceData} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default PresenceCalendar;
