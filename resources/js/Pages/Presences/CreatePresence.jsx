import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CreatePresencesDataTable from './DataTable/CreatePresencesDataTable';

const CreatePresence = ({ auth, presences, conges }) => {
    const [presenceData, setPresencesData] = useState([]);
    const [dateQuery, setDateQuery] = useState(new Date());
    console.log('presences from DB : ', presences)
    const transformData = (presences, selectedDate) => {
        const formattedDate = new Date(selectedDate).toLocaleDateString("en-GB").replace(/\//g, "-"); 
    
        return presences.reduce((acc, presence) => {
            const presenceDataForDate = JSON.parse(presence.presence_data)[formattedDate] || {}; 
    
            if (Object.keys(presenceDataForDate).length > 0) {
                acc.push({
                    id: presence.id,
                    employee_id: presence.employee_id,
                    employee_name: presence.employee.name,
                    month: presence.month,
                    date: formattedDate, 
                    shift: presenceDataForDate.shift,
                    hours: presenceDataForDate.hours || null,
                    raison: presenceDataForDate.raison || null,
                    conge_id: presenceDataForDate.conge_id || null,
                    type_salaire: presence.typesalaire,
                    status: presenceDataForDate.status
                });
            }
            return acc;
        }, []);
    };
    

    useEffect(() => {
        const transformedData = transformData(presences, dateQuery);
        setPresencesData(transformedData);
        
    }, [presences, dateQuery]);

    const handleDateChange = (selectedDate) => {
        setDateQuery(selectedDate);
    };
    console.log('Presence Data depends on date :',presenceData);

    return (
        <AuthenticatedLayout auth={auth} header={'Marquer la présence'}>
            <CreatePresencesDataTable
                presences={presenceData}
                setPresencesData={setPresencesData}
                conges={conges}
                onDateChange={handleDateChange} 
                selectedDate={dateQuery} 
            />
        </AuthenticatedLayout>
    );
};

export default CreatePresence;
