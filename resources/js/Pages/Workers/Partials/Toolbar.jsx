
import React, {useState} from 'react';
import { Toolbar } from 'primereact/toolbar';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Link, useForm } from '@inertiajs/react';
import { Timeline } from 'primereact/timeline';
import { formatDate } from '@/utils/formatDate';
export default function ToolbarField({product,setData, handleSubmit,employee_contracts, type_salairs, contractsType}) {
    const [checked, setChecked] = useState(product.status == 'active');
    const [deleteProductDialog, setDeleteProductDialog] = useState(false)
    const [historyDialog, setHistoryDialog] = useState(false)
    const {
        delete: destroy, 
        processing,      
        reset,         
    } = useForm();
    
    const confirmDeleteProduct = () => {
        setDeleteProductDialog(true);  
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const handleStatus = (e)=>{
        setChecked(e.value)
        setData((prevProduct) => ({
            ...prevProduct, 
            status: prevProduct.status === "active" ? "inactive" : "active"
        }));
    }

    const deleteProduct = (e) => {
        e.preventDefault();
            destroy(route('workers.destroy', product.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setProducts(products.filter((productOld)=> productOld.id !== product.id))
                    closeModal();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employeé Deleted', life: 3000 });
                },  // Close modal if successful
                onError: () => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete employees', life: 3000 });
                },              
                onFinish: () => reset(),        // Reset form state on finish
            });
    };

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Non" className='mr-1' icon="ti ti-circle-x" outlined onClick={hideDeleteProductDialog} />
            <Button label="Oui" icon="ti ti-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );

    const startContent = (
        <React.Fragment>
            <Button label='Enregistrer' icon="ti ti-check" className="mr-2" onClick={()=>handleSubmit()}/>
            <Button icon="ti ti-trash" severity='danger' className="mr-2" onClick={()=> confirmDeleteProduct()}/>
        </React.Fragment>
    );

    const showHistory = () =>{
        setHistoryDialog(true)
    }
    const hideHistoryDialog = () => {
        setHistoryDialog(false)
    }
    

    const endContent = (
        <React.Fragment>
            <div className='flex items-center gap-2'>
                <div className="flex gap-2" >
                    <label htmlFor="status">Active?</label>
                    <InputSwitch
                        id={"status"}
                        checked={checked} onChange={(e) => handleStatus(e)}
                    />
                </div>
                <Button icon="ti ti-history" label='Historique des contrats' rounded outlined severity="warning" aria-label="History" onClick={showHistory}/>
            </div>
        </React.Fragment>
    );
    console.log(contractsType);
    
    const events = employee_contracts.map((emp,index) => {
        // Find the contract type name based on the contract_id
        const status = contractsType.find((c) => c.id === emp.contract_id)?.name || "";
        const salary_type = type_salairs.find((c)=>c.id ===emp.salary_type_id)?.type || "";
        const amount = emp.amount;
        const contract_end_date = formatDate(emp.contract_end_date, '/');
        const contract_start_date = formatDate(emp.contract_end_date, '/');
        const i = index+1;
        // Return an object with the status
        return { status, salary_type, amount, contract_end_date, contract_start_date, i};
    });
    
    console.log(events);
    
    console.log(events);
    
    const customizedMarker = (item) => {
        return (
            <span className="flex w-2rem h-2rem align-items-center justify-content-center font-semibold text-slate-500 border-circle z-1 shadow-1 ">
                {item.i}
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card title={item.status}>
                <div className='text-gray-500 font-semibold '> <span className='font-medium'>Date de début de contrat :</span> {item.contract_start_date}</div>
                <div className='text-gray-500 font-semibold '> <span className='font-medium'>Date de fin de contrat :</span>{item.contract_end_date}</div>
                <div className='text-gray-500 font-semibold '> <span className='font-medium'>Salaire :</span> Mensuelle ({item.amount} TND)</div>
            </Card>
        );
    };

    return (
        <div className="card">
            <Toolbar start={startContent} end={endContent} />

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Supprimer employeé" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="ti ti-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        <span>
                            Êtes-vous sûr de vouloir supprimer cet employée?
                        </span>
                </div>
            </Dialog>

            <Dialog visible={historyDialog} style={{ width: '64rem'}} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Historique des contrats" modal onHide={hideHistoryDialog} >
            <Timeline value={events} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
            </Dialog>
        </div>
    );
}
        