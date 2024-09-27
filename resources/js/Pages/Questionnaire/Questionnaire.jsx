import React, { useEffect, useState, useRef } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuestionnaireDataTable from './DataTable/QuestionnaireDataTable';
import { Toast } from 'primereact/toast';
import AddQuestionnaire from './Modal/AddQuestionnaire';

const Questionnaire = ({auth, questionnaires, employees, sanctions}) => {
  console.log(questionnaires);
  let emptyQuest = {
    id: null,
    id_emp: null,
    description: '',
    id_sanction: null,
    date: null
};
const toast = useRef(null);

const [productDialog, setProductDialog] = useState(false);
const [product, setProduct] = useState(emptyQuest);

const [submitted, setSubmitted] = useState(false);

  const [questionnairesData, setQuestionnairesData] = useState(questionnaires)
  console.log(sanctions);
  
  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
};

useEffect(()=>{
  setQuestionnairesData(questionnaires);
  setProduct(emptyQuest)
},[submitted])
  return (
    <AuthenticatedLayout
    auth={auth}
    header={'Liste des questionnaires'}>
      <Toast ref={toast} />
     <QuestionnaireDataTable 
     products={questionnairesData} 
     setProducts={setQuestionnairesData}
    //  productDialog={productDialog}
    setProductDialog={setProductDialog}
    product={product}
    setProduct={setProduct}
    //  hideDialog={hideDialog}
     toast={toast}
    //  submitted={submitted}
    //  sanctions={sanctions}
    //  setSubmitted={setSubmitted}
    //  emptyQuest={emptyQuest }
    //  employees={employees}
     
     />
     {
      productDialog && (
        <AddQuestionnaire 
          productDialog={productDialog}
          hideDialog={hideDialog}
          toast={toast}
          submitted={submitted}
          product={product}
          setSubmitted={setSubmitted}
     employees={employees}
     sanctions={sanctions}
        setProduct={setProduct}
          />
      )
     }
    </AuthenticatedLayout>
  )
}

export default Questionnaire