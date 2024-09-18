import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import React from 'react'

const CollapsedDataTable = ({rowData, conges}) => {
    const statusAdmin = [
        {severity:'secondary', label: 'Aucune' },
        {severity:'warning', label: 'En Attente' },
        {severity:'danger', label: 'Rejeté' },
        {severity:'success', label: 'Approuvé' },
    ]
    
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
    
    const actionsTemplate = () => {
        return <Button severity='warning' rounded icon='ti ti-edit' />
    }
    const data = JSON.parse(rowData.presence_data);
    
    const transformedData = transformPresenceData(data);

    console.log('Conges', conges);
    console.log('transformedData', transformedData);
    
    const congeTemplate = (rowData) => {
        console.log(rowData);
        if (rowData.conge_id){
            const a = conges.filter(conge => conge.id == rowData.conge_id)
            return a[0].nom_conge;
            
        }
    }
    
    return (
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
    );
}

export default CollapsedDataTable

