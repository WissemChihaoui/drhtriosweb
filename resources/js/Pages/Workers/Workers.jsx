import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WorkersDataTable from './DataTable/WorkersDataTable';

const Workers = ({ auth, mustVerifyEmail, status, employees,departements, employee_contracts, contractsType }) => {
  return (
    <AuthenticatedLayout
      auth={auth}
      header={'Liste des employées'}
    >
      <WorkersDataTable 
      employees={employees} 
      departements={departements} 
      contractsType={contractsType}
      employee_contracts={employee_contracts}
      />
    </AuthenticatedLayout>
  )
}

export default Workers
