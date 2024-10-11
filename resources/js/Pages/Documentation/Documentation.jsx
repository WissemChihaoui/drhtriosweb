import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import RapportJournalier from './Partials/RapportJournalier'
import Rapport1 from './Partials/Rapport1'
import Rotation from './Partials/Rotation'
import FormatEmp from './Partials/FormatEmp'

const Documentation = ({auth}) => {
  return (
    <AuthenticatedLayout
    auth={auth}
    header={'Documentation'}>
        <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2'>
            <RapportJournalier />
            <Rapport1 />
            <Rotation />
            <FormatEmp />
        </div>
    </AuthenticatedLayout>
  )
}

export default Documentation