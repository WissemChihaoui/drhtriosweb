import React, { useState, useRef, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PresencesDataTable from './DataTable/PresencesDataTable';

const Presences = ({auth, presences, conges}) => {
    const [presencesData, setPresencesData] = useState(presences)
    
    useEffect(()=>{
        setPresencesData(presences);
    },[presences])
    console.log(presencesData)
  return (
    <AuthenticatedLayout
    auth={auth}
    header={'Liste des présences'}>
        <PresencesDataTable presences={presencesData} conges={conges} />
    </AuthenticatedLayout>
  )
}

export default Presences