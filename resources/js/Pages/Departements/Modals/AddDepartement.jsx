import React,{useState} from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useForm } from "@inertiajs/react";


const AddDepartement = ({productDialog, hideDialog, toast,submitted,setSubmitted, product}) => {
    
    const { post, setData, data, errors } = useForm(product);
    
    
    const saveProduct = () => {
        setSubmitted(true);
        const allFonctionsFilled = data.fonctions.every(fonction => fonction.name.trim() !== '');
        console.log('Submitted Data', data);
        
        if (data.nom_departement.trim() && allFonctionsFilled) {
            console.log('Submited data:',data);
           post(route('add.departement'),{
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
    const onInputChange = (e, nom_departement) => {
        const val = e.target.value;
        setData({ ...data, [nom_departement]: val });
    };
    // Add a new fonction to the array
    const addFonction = () => {
        setData({ ...data, fonctions: [...data.fonctions, { name: "" }] });
    };

    // Remove a fonction from the array
    const removeFonction = (index) => {
        const updatedFonctions = data.fonctions.filter((_, i) => i !== index);
        setData({ ...data, fonctions: updatedFonctions });
    };
    const onFonctionChange = (index, e) => {
        const updatedFonctions = [...data.fonctions];
        updatedFonctions[index].name = e.target.value;
        setData({ ...data, fonctions: updatedFonctions });
    };
  return (
  <div>
      
        <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Ajouter Département" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <div className="field mb-4">
                <label htmlFor="name" className="font-bold mb-2">
                    Nom
                </label>
                <InputText id="name" value={data.nom_departement} onChange={(e) => onInputChange(e, 'nom_departement')} required autoFocus className={classNames({ 'p-invalid': submitted && !data.nom_departement })} />
                {submitted && !data.nom_departement && <small className="p-error">Nom est requis.</small>}
            </div>
            <div className="field mb-4">
                    <label className="font-bold mb-2">Fonctions</label>
                    {data.fonctions.map((fonction, index) => (
                        <div className='mb-2' key={index}>
                            <div  className="flex ">
                                <InputText
                                    value={fonction.name}
                                    onChange={(e) => onFonctionChange(index, e)}
                                    placeholder={`Fonction ${index + 1}`}
                                    className={classNames({ 'p-invalid': submitted && !fonction.name })}
                                />
                                <Button
                                    icon="ti ti-trash"
                                    className="p-button-danger ml-2"
                                    onClick={() => removeFonction(index)}
                                    disabled={data.fonctions.length === 1} // Disable remove if only one
                                />
                            </div>
                            {submitted && !fonction.name && <small className="p-error">Remplir ce fonction.</small>}
                        </div>
                    ))}
                    <Button severity='success' label="Ajouter Fonction" icon="ti ti-plus" className="p-button-secondary mt-2" onClick={addFonction} />
                </div>
        </Dialog>
  </div>
  )
}

export default AddDepartement