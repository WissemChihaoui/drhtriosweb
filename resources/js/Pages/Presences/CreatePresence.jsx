import React, { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CreatePresencesDataTable from './DataTable/CreatePresencesDataTable';

const CreatePresence = ({auth, presences, conges}) => {
    const [presenceData, setPresencesData] = useState([]);
    console.log(presences);
    
    // Function to transform presence data
    const transformData = (presences) => {
        console.log(presences);
        
        const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-"); // Default today's date
        return presences.map((presence) => {
            const presenceDataToday = JSON.parse(presence.presence_data)[today] || {}; // Get presence data for today, if it exists
            
            return {
                id: presence.id,
                employee_id: presence.employee_id,
                employee_name: presence.employee.name,
                month: presence.month,
                date: today, // default to today
                shift: presenceDataToday.shift,
                hours: presenceDataToday.hours || null,
                raison: presenceDataToday.raison || null,
                conge_id: presenceDataToday.conge_id || null,
                type_salaire: presence.typesalaire,
                status: presenceDataToday.status
            };
        });
    };

    useEffect(() => {
        const transformedData = transformData(presences);
        setPresencesData(transformedData);
    }, []);

    console.log(presenceData); // Verify transformed data
    
    return (
        <AuthenticatedLayout auth={auth} header={'Marquer la présence'}>
            <CreatePresencesDataTable presences={presenceData} setPresencesData={setPresencesData} conges={conges}/>
        </AuthenticatedLayout>
    )
}

export default CreatePresence;
