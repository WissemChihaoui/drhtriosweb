import React,{useEffect, useState} from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useForm } from "@inertiajs/react";

const AddConge = ({productDialog, hideDialog, toast,submitted,product,setSubmitted}) => {
   
    const { post, setData, data, errors } = useForm(product);
    

   useEffect(()=> {
    setData(product)
    console.log('Data', data);
    console.log('Product', product);
    
   },[productDialog])
    
    const saveProduct = () => {
        setSubmitted(true);
        console.log('Submitted Data', data);
        
        if (data.nom_conge.trim()) {
            console.log('Submited data:',data);
           post(route('conges.store'),{
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
    const onInputChange = (e, nom_conge) => {
        const val = e.target.value;
        setData({ ...data, [nom_conge]: val });
    };
  return (
  <div>
      
        <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`${data.id ? 'Modifier':'Ajouter'} type de contrat`} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <div className="field mb-4">
                <label htmlFor="name" className="font-bold mb-2">
                    Nom
                </label>
                <InputText id="nom_conge" value={data.nom_conge} onChange={(e) => onInputChange(e, 'nom_conge')} required autoFocus className={classNames({ 'p-invalid': submitted && !data.nom_conge })} />
                {submitted && !data.nom_conge && <small className="p-error">Nom est requis.</small>}
            </div>
        </Dialog>
  </div>
  )
}

export default AddConge