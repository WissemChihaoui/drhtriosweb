
import React, {useState} from 'react';
import { Toolbar } from 'primereact/toolbar';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Link, useForm } from '@inertiajs/react';
export default function ToolbarField({product,setData, handleSubmit}) {
    const [checked, setChecked] = useState(product.status == 'active');
    const [deleteProductDialog, setDeleteProductDialog] = useState(false)
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

    

    const endContent = (
        <React.Fragment>
            <div className="flex gap-2" >
                <label htmlFor="status">Active?</label>
                <InputSwitch
                    id={"status"}
                    checked={checked} onChange={(e) => handleStatus(e)}
                />
            </div>
        </React.Fragment>
    );

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
        </div>
    );
}
        