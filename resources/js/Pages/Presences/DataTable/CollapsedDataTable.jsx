import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import React, {useState} from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';

const CollapsedDataTable = ({rowData, conges}) => {
    const [selectedRow, setSelectedRow] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const statusAdmin = [
        {severity:'secondary', label: 'Aucune', id:0 },
        {severity:'warning', label: 'En Attente' , id:1},
        {severity:'danger', label: 'Rejeté', id:2 },
        {severity:'success', label: 'Approuvé' , id:3},
    ]
    const hideDialog = () => {
        setIsOpenModal(false)
        setSelectedRow(null);
    }
    const editOpen = (rowDataSelected) => {
        setSelectedRow(rowDataSelected);
        setIsOpenModal(true)

        console.log(rowDataSelected);
    }
    
    const transformPresenceData = (presenceData) => {
        return Object.keys(presenceData).map(date => ({
            date,
            ...presenceData[date]
        }));
    };
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
    const data = JSON.parse(rowData.presence_data);
    
    const transformedData = transformPresenceData(data);
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
        console.log(selectedRow);
    }

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" className='mr-1' outlined onClick={hideDialog} />
            <Button label="Enregistrer" icon="ti ti-check" onClick={handleSubmit}/>
        </React.Fragment>
    );

    const handleCongeChange = (e) => {
        setSelectedRow({
            ...selectedRow,

            conge_id: e.value
        })
    }
    const handleStatusChange = (e) => {
        setSelectedRow({
            ...selectedRow,

            status: e.value
        })
    }

   
    
    return (
        <div>
            <div className="p-3 border border-gray-600 rounded">
                <h5 className='mb-2 font-bold text-xl'>Présence Mensuelle de {rowData.employee.name}</h5>
                <DataTable paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} value={transformedData} responsiveLayout="scroll" sortField="date" sortOrder={-1}>
                    <Column field="date" header="Date" sortable/>
                    <Column field="status" body={statusCollapsedTemplate} header="Statut de présence" sortable />
                    <Column field="shift" header="Shift" sortable />
                    <Column field="hours" header="Nb des heures" sortable />
                    <Column field="conge_id" header="Type" sortable body={congeTemplate}/>
                    <Column field="raison" header="Raison" sortable />
                    <Column field='action' header="Statut Administrative" sortable body={adminStatusTemplate}/>
                    <Column header="Actions" body={actionsTemplate}/>
                </DataTable>
            </div>
            {selectedRow && <Dialog visible={isOpenModal} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Modifier l'absence" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <div className="">
                <div className="mb-2">
                    Raison: <span className='font-bold '>{selectedRow.raison || ""}</span>
                </div>
                <div className="mb-2">
                    Type de congé: 
                    <div className="font-bold">
                        <Dropdown options={conges} optionLabel='nom_conge' optionValue='id' value={selectedRow.conge_id} onChange={(e)=>handleCongeChange(e)}/>
                    </div>
                </div>
                <div className="mb-2">
                    Type de congé: 
                    <div className="font-bold">
                        <Dropdown options={statusAdmin} optionLabel='label' optionValue='id' value={selectedRow.status} onChange={(e)=>handleStatusChange(e)}/>
                    </div>
                </div>
                
                {/* {submitted && !data.name && <small className="p-error">Nom est requis.</small>} */}
            </div>
            </Dialog>}
        </div>
    );
}

export default CollapsedDataTable

