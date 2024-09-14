import React , {useEffect, useRef, useState} from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Toast } from 'primereact/toast';
import MachinesDataTable from './DataTable/MachinesDataTable';
import AddMachine from './Modals/AddMachine';

const Machines = ({auth,machines}) => {
    let emptyMachine = {
        id: null,
        id_societe:1,
        name: ''
    };
    console.log(machines);
    
    const [machinesData, setMachinesData] = useState(null)
    const [machine, setMachine] = useState(emptyMachine)
    const [productDialog, setProductDialog] = useState(false)
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null)
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setMachine(emptyMachine)
      };
      
      useEffect(() => {
        setMachinesData(machines);
        setMachine(emptyMachine)
    }, [submitted]);
    
  return (
    <AuthenticatedLayout
    auth={auth}
    header={'Liste des machines'}>
        <Toast ref={toast} />
        <MachinesDataTable products={machinesData} setProducts={setMachinesData} productDialog={productDialog} setProductDialog={setProductDialog} product={machine} setProduct={setMachine}/>
        {productDialog && <AddMachine productDialog={productDialog} hideDialog={hideDialog} toast={toast} submitted={submitted} product={machine} setSubmitted={setSubmitted}/>}
    </AuthenticatedLayout>
  )
}

export default Machines