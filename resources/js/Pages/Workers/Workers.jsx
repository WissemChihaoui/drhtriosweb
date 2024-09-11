import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WorkersDataTable from './DataTable/WorkersDataTable';

const Workers = ({ auth, mustVerifyEmail, status, employees }) => {
  return (
    <AuthenticatedLayout
      auth={auth}
      header={'Liste des employées'}
    >
      <WorkersDataTable employees={employees} />
    </AuthenticatedLayout>
  )
}

export default Workers
