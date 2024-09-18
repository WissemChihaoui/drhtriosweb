import React, { useState, useRef, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PresencesDataTable from './DataTable/PresencesDataTable';

const Presences = ({auth, presences, conges}) => {
    const [presencesData, setPresencesData] = useState(null)
    useEffect(()=>{
        setPresencesData(presences);
    },[presences])
  return (
    <AuthenticatedLayout
    auth={auth}
    header={'Liste des présences'}>
        <PresencesDataTable presences={presencesData} conges={conges}/>
    </AuthenticatedLayout>
  )
}

export default Presences