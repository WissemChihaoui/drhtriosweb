import React, { useState, useRef, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SanctionsDataTable from './DataTable/SanctionsDataTable';
import AddSanction from './Modals/AddSanction';
import { Toast } from 'primereact/toast';

const Sanctions = ({auth, sanctions}) => {
  const emptySanction = {
    id: null,
    type_sanction : '',
  }
    console.log(sanctions);

    const [sanctionsData, setSanctionsData] = useState(null)
    const [sanction, setSanction] = useState(emptySanction)
    const [productDialog, setProductDialog] = useState(false)
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null)

    const hideDialog = () => {
      setSubmitted(false);
      setProductDialog(false);
      setSanction(emptySanction)
    };

    useEffect(() => {
      setSanctionsData(sanctions);
      setSanction(emptySanction)
    }, [submitted]);

  return (
    <AuthenticatedLayout
    auth={auth}
    header={'Liste des sanctions'}>
      <Toast ref={toast} />
        <SanctionsDataTable products={sanctionsData}  setProducts={setSanctionsData} productDialog={productDialog} setProductDialog={setProductDialog} product={sanction} setProduct={setSanction} />
        {productDialog && <AddSanction productDialog={productDialog} hideDialog={hideDialog} toast={toast} submitted={submitted} product={sanction} setSubmitted={setSubmitted} />}
    </AuthenticatedLayout>
  )
}

export default Sanctions