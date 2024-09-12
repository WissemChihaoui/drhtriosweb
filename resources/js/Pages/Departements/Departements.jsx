import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DepartementDataTable from './DataTable/DepartementDataTable';

const Departements = ({ auth, departements }) => {
  console.log(departements);
  
  return (
    <AuthenticatedLayout
      auth={auth}
      header={'Liste des départements'}
    >
        <DepartementDataTable departements={departements}/>
    </AuthenticatedLayout>
    
  )
}

export default Departements