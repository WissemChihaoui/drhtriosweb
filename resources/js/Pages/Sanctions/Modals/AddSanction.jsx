import React,{useState} from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useForm } from "@inertiajs/react";

const AddSanction = ({productDialog, hideDialog, toast,submitted,setSubmitted, product}) => {
   
    const { post, setData, data, errors } = useForm(product);
    
    
    const saveProduct = () => {
        setSubmitted(true);
        console.log('Submitted Data', data);
        
        if (data.type_sanction.trim()) {
            console.log('Submited data:',data);
           post(route('sanctions.store'),{
                onError: (error) => {
                    console.log('ERREUR',error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Un problème survient.',
                        life: 3000
                    });
                },
                onSuccess: () => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Ajouté',
                        detail: 'Votre Modification est effectué.',
                        life: 2000
                    });
                    hideDialog();
                    
                }
           }) 
        }
    };
    
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" className='mr-1' outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="ti ti-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const onInputChange = (e, name) => {
        const val = e.target.value;
        setData({ ...data, [name]: val });
    };
  return (
  <div>
      
        <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Ajouter Sanction" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <div className="field mb-4">
                <label htmlFor="name" className="font-bold mb-2">
                    Nom
                </label>
                <InputText id="type_sanction" value={data.type_sanction} onChange={(e) => onInputChange(e, 'type_sanction')} required autoFocus className={classNames({ 'p-invalid': submitted && !data.type_sanction })} />
                {submitted && !data.type_sanction && <small className="p-error">Nom est requis.</small>}
            </div>
        </Dialog>
  </div>
  )
}

export default AddSanction