import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import React, {useState} from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { useForm } from '@inertiajs/react';

const CollapsedDataTable = ({rowData, conges}) => {
    const {data, setData, post} = useForm({
        action: null,
        conge_id: null,
        date : null,
        hours: null,
        raison: null,
        shift: null,
        status: null
    })
    // const [data, setData] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [id, setId] = useState(rowData.id)
    console.log('Row Data,' , rowData);
    
    
    const statusAdmin = [
        {severity:'warning', label: 'En Attente' , id:0},
        {severity:'secondary', label: 'Aucune', id:1 },
        {severity:'danger', label: 'Rejeté', id:2 },
        {severity:'success', label: 'Approuvé' , id:3},
    ]
    const hideDialog = () => {
        setIsOpenModal(false)
        setData(null);
    }
    const editOpen = (rowDataSelected) => {
        setData(rowDataSelected);
        setIsOpenModal(true)

        console.log(rowDataSelected);
    }
    
    const transformPresenceData = (presenceData) => {
        return Object.keys(presenceData).map(date => ({
            date,
            ...presenceData[date]
        }));
    };
    const shiftTemplate = (rowData) => {
        const a = ['', 'Un Jour', 'Demi Jour', ''];
        // console.log(a[rowData.raison]);
        console.log('from ',rowData);
        
        
        return rowData.status == 1 ? a[rowData.shift] : null;
    }
    const statusCollapsedTemplate = (rowData) => {
        return <Tag severity={rowData.status == 1 ? 'success' : 'danger'}>{rowData.status == 1 ? 'Présent' : 'Absent'}</Tag>
    }
    
    const adminStatusTemplate = (rowData) => {
        
        const actionIndex = parseInt(rowData.action) || 0;
        
        const statusInfo = statusAdmin[actionIndex] || statusAdmin[0];
        return <Tag severity={statusInfo.severity} >{statusInfo.label}</Tag>
    }
    
    const actionsTemplate = (rowData) => {
        return <Button severity='warning' rounded icon='ti ti-edit' onClick={()=>editOpen(rowData)}/>
    }
    const presenceData = JSON.parse(rowData.presence_data);
    
    const transformedData = transformPresenceData(presenceData);
    console.log(conges);
    
    const congeTemplate = (rowData) => {
        if (rowData.conge_id){
            const a = conges.filter(conge => conge.id == rowData.conge_id)
            if (a[0]){
                return a[0].nom_conge;
            }else{
                return ''
            }
            
        }
    }

    const handleSubmit =()=> {
        hideDialog();
        console.log('Submitted Data',data);
        setData(data)
        console.log(id);
        post(route('create.presence.edit', id), {
            onError: (error) => {
                console.error("Submission Error:", error);
            },
            onSuccess: () => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Les présences ont été mises à jour avec succès.',
                    life: 3000
                });
            }
        })
    }

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" className='mr-1' outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="ti ti-check" onClick={handleSubmit}/>
        </React.Fragment>
    );

    const handleCongeChange = (e) => {
        setData({
            ...data,
            conge_id: e.value
        })
    }
    const handleStatusChange = (e) => {
        setData({
            ...data,

            action: e.value
        })
    }
    const handleRaisonChange = (e) =>{
        setData({
            ...data,
            raison: e.target.value
        })
    }

    
   
    
    return (
        <div>
            <div className="p-3 border border-gray-600 rounded">
                <h5 className='mb-2 font-bold text-xl'>Présence Mensuelle de {rowData.employee.name}</h5>
                <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} value={transformedData} responsiveLayout="scroll" sortField="date" sortOrder={-1}>
                    <Column field="date" header="Date" sortable/>
                    <Column field="status" body={statusCollapsedTemplate} header="Statut de présence" sortable />
                    <Column field="shift" header="Shift" sortable body={shiftTemplate}/>
                    <Column field="hours" header="Nb des heures" sortable />
                    <Column field="conge_id" header="Type" sortable body={congeTemplate}/>
                    <Column field="raison" header="Raison" sortable />
                    <Column field='action' header="Statut Administrative" sortable body={adminStatusTemplate}/>
                    <Column header="Actions" body={actionsTemplate}/>
                </DataTable>
            </div>
            {data && <Dialog visible={isOpenModal} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Modifier l'absence" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <div className="">
                <div className="mb-2">
                    Raison: <InputText value={data.raison} onChange={(e)=>handleRaisonChange(e)}/>
                </div>
                <div className="mb-2">
                    Type de congé: 
                    <div className="font-bold">
                        <Dropdown options={conges} optionLabel='nom_conge' optionValue='id' value={data.conge_id} onChange={(e)=>handleCongeChange(e)}/>
                    </div>
                </div>
                <div className="mb-2">
                    Statut Administrative: 
                    <div className="font-bold">
                        <Dropdown options={statusAdmin} optionLabel='label' optionValue='id' value={data.action} onChange={(e)=>handleStatusChange(e)}/>
                    </div>
                </div>
                
                {/* {submitted && !data.name && <small className="p-error">Nom est requis.</small>} */}
            </div>
            </Dialog>}
        </div>
    );
}

export default CollapsedDataTable

