import React,{useState} from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useForm } from '@inertiajs/react';

const AddQuestionnaire = ({productDialog,hideDialog,toast,submitted,product,setSubmitted, employees, sanctions, setProduct}) => {
    const { data, setData, post } = useForm();
    
    const saveProduct = () => {
        setSubmitted(true);
        setData(product)
        console.log('Submitted :',data)
        post(route('questionnaire.store'),{
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
    };
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="ti ti-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="ti ti-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };
  return (
    <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Ajouter un questionnaire" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                
                <div className="field mb-2">
                    <label htmlFor="name" className="font-bold">
                        Employée
                    </label>
                   <Dropdown options={employees} value={product.id_emp} optionLabel='name' optionValue='id' onChange={(e) => onInputChange(e, 'id_emp')}/>
                    {submitted && !product.id_emp && <small className="p-error">Employée est requis.</small>}
                </div>
                <div className="field mb-2">
                    <label htmlFor="name" className="font-bold">
                        Sanction
                    </label>
                   <Dropdown options={sanctions} value={product.id_sanction} optionLabel='type_sanction' optionValue='id' onChange={(e) => onInputChange(e, 'id_sanction')}/>
                    {submitted && !product.id_sanction && <small className="p-error">Sanction est requis.</small>}
                </div>
                <div className="field mb-2">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>
                <div className="field mb-2">
                    <label htmlFor="date" className="font-bold">
                        Date
                    </label>
                    <Calendar value={product.date} onChange={(e)=>onInputChange(e, 'date')}/>
                </div>

            </Dialog>
  )
}

export default AddQuestionnaire