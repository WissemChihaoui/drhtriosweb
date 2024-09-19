import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';


const CreatePresencesDataTable = ({ presences, setPresencesData, conges }) => {

    const [globalFilter, setGlobalFilter] = useState(null);
    const today = new Date().toLocaleDateString("en-US");
    console.log(today);
    
    const [date, setDate] = useState();

    useEffect(()=> {
        setDate(today)
    },[])
    const handleShiftChange = (rowData, value) => {
        const updatedShift = presences.map(presence => {
            if (presence.id === rowData.id){
                return { ...presence, shift: value};
            }
            return presence;
        })

        setPresencesData(updatedShift)

    }
    const handleHoursChange = (rowData, value) => {
        const updatedShift = presences.map(presence => {
            if (presence.id === rowData.id){
                return { ...presence, hours: value};
            }
            return presence;
        })

        setPresencesData(updatedShift)

    }
    const handleTypeChange = (rowData, value) => {
        const updatedShift = presences.map(presence => {
            if (presence.id === rowData.id){
                return { ...presence, conge_id: value};
            }
            return presence;
        })

        setPresencesData(updatedShift)

    }
    const handleRaisonChange = (rowData, value) => {
        const updatedShift = presences.map(presence => {
            if (presence.id === rowData.id){
                return { ...presence, raison: value};
            }
            return presence;
        })

        setPresencesData(updatedShift)

    }
    const handleSwitchChange = (rowData, value) => {
        // Toggle the status
        const updatedPresences = presences.map(presence => {
            if (presence.id === rowData.id) {
                return { ...presence, status: value ? 1 : 0 }; // Update status (1 = present, 0 = absent)
            }
            return presence;
        });
        handleHoursChange(rowData, 0);
        handleRaisonChange(rowData, null)
        handleTypeChange(rowData, 0)
        setPresencesData(updatedPresences);
    };
    const statutTemplate = (rowData) => {
        return (
         
              <InputSwitch checked={rowData.status == 1} onChange={(e) => handleSwitchChange(rowData, e.value)} />
            
        );
    };

    const shiftTemplate = (rowData) => {
        const shiftOptions = [
            { name: 'Un Jour', code: 1 },
            { name: 'Démi Jour', code: 2 },
          ];
          if (!rowData.status){
            return '';
          }
        if (rowData.type_salaire == "Mensuelle"){
           return <Dropdown 
                    options={shiftOptions} 
                    onChange={(e) => handleShiftChange(rowData, e.value)} 
                    optionLabel='name'
                    optionValue='code'
                    className='w-full' 
                    value={rowData.shift}/>
        }
        return <InputNumber value={rowData.hours} onChange={(e)=> handleHoursChange(rowData, e.value)} inputId="minmax-buttons" showButtons min={0} max={100} step={0.5} className='w-full'/>;
    }
    

    const typeTemplate = (rowData) => {
        if(!rowData.status){
            return <Dropdown
                    className='w-full'
                    options={conges}
                    optionLabel='nom_conge'
                    optionValue='id'
                    value={rowData.conge_id}
                    placeholder='Choisir Type de congés'
                    onChange={(e)=>handleTypeChange(rowData, e.value)}
                    />
        }
        return ''
    }

    const raisonTemplate = (rowData)=> {
        if(!rowData.status){
            return <InputText 
                    value={rowData.raison} 
                    onChange={(e)=>handleRaisonChange(rowData, e.target.value)}
                    placeholder='Commentaire'
                    />
        }
        return ''
    }

    const handleSubmit = ()=> {
        console.log(presences)
    }
    const header = (
       <div className="flex justify-between">
           <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." /> 
           <div className="">
                <Button label='Enregistrer' onClick={()=>handleSubmit()} className='mr-2'/>
                <Calendar value={date} onChange={(e) => setDate(e.value)} />
            </div>
       </div>
    );

    return (
        <div className="card">
            <DataTable value={presences} header={header} globalFilter={globalFilter}>
                <Column field="employee_id" header="#ID" style={{ minWidth: '5%' }} />
                <Column field="employee_name" header="Nom" style={{ minWidth: '20%' }}/>
                <Column field="status" header="Statut de présence" body={statutTemplate} style={{ minWidth: '15%'}}/>
                <Column field='shift' header="Shift" body={shiftTemplate} style={{minWidth:'10%'}}/>
                <Column field='id_conge' header="Type" body={typeTemplate} style={{minWidth: '10%'}}/>
                <Column field='raison' header='Raison' body={raisonTemplate} style={{minWidth: '15%'}}/>
            </DataTable>
        </div>
    );
};

export default CreatePresencesDataTable;
