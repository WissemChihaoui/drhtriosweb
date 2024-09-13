import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PolyvalenceDataTable from './DataTable/PolyvalenceDataTable';

const Polyvalences = ({auth, employeesWithPolyvalences}) => {
    console.log(employeesWithPolyvalences);
    
  return (
    <AuthenticatedLayout
    auth={auth}
    header={'Liste des polyvalence'}>
        <PolyvalenceDataTable employees={employeesWithPolyvalences}/>
    </AuthenticatedLayout>
  )
}

export default Polyvalences