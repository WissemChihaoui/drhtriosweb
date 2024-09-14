import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Sanctions = ({auth, sanctions}) => {
    console.log(sanctions)
  return (
    <AuthenticatedLayout
    auth={auth}
    header={'Liste des sanctions'}>
        Sanctions
    </AuthenticatedLayout>
  )
}

export default Sanctions