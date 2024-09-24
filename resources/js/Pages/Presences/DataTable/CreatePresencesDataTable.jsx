import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useForm } from '@inertiajs/react';


const CreatePresencesDataTable = ({ presences, setPresencesData, conges, onDateChange, selectedDate }) => {
    const { data, setData, post } = useForm({});
    const [globalFilter, setGlobalFilter] = useState(null);

    // Generalized handleChange function to update both state and form data
    const handleChange = (rowData, field, value) => {
        const updatedPresences = presences.map(presence => {
            if (presence.id === rowData.id) {
                return { ...presence, [field]: value };
            }
            return presence;
        });
        setPresencesData(updatedPresences);
        setData("presences", updatedPresences); // Update form data with the modified presence data
    };

    // Handle form submission with date
    const handleSubmit = () => {
        const formattedDate = new Date(selectedDate).toLocaleDateString("en-GB").replace(/\//g, "-");
        
        console.log("Formatted Date:", formattedDate);
        console.log("Submitting Data:", data);

        // Post form data to the backend
        post(route('create.presence.submit', formattedDate), {
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
        });
    };

    // Column templates
    const statutTemplate = (rowData) => (
        <InputSwitch checked={rowData.status === 1} onChange={(e) => handleChange(rowData, 'status', e.value ? 1 : 0)} />
    );

    const shiftTemplate = (rowData) => {
        const shiftOptions = [
            { name: 'Un Jour', code: 1 },
            { name: 'Démi Jour', code: 2 },
        ];

        if (!rowData.status) return '';

        if (rowData.type_salaire === "Mensuelle") {
            return (
                <Dropdown
                    options={shiftOptions}
                    onChange={(e) => handleChange(rowData, 'shift', e.value)}
                    optionLabel="name"
                    optionValue="code"
                    className="w-full"
                    value={rowData.shift}
                />
            );
        }

        return (
            <InputNumber value={rowData.hours} onChange={(e) => handleChange(rowData, 'hours', e.value)} inputId="minmax-buttons" showButtons min={0} max={100} step={0.5} className="w-full" />
        );
    };

    const typeTemplate = (rowData) => {
        if (!rowData.status) {
            return (
                <Dropdown
                    className="w-full"
                    options={conges}
                    optionLabel="nom_conge"
                    optionValue="id"
                    value={rowData.conge_id}
                    placeholder="Choisir Type de congés"
                    onChange={(e) => handleChange(rowData, 'conge_id', e.value)}
                />
            );
        }
        return '';
    };

    const raisonTemplate = (rowData) => {
        if (!rowData.status) {
            return (
                <InputText
                    value={rowData.raison}
                    onChange={(e) => handleChange(rowData, 'raison', e.target.value)}
                    placeholder="Commentaire"
                />
            );
        }
        return '';
    };

    // Table header with calendar picker and save button
    const header = (
        <div className="flex justify-between">
            <InputText
                type="search"
                placeholder="Rechercher..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <div className="">
                <Button label="Enregistrer" className="mr-2" onClick={handleSubmit} />
                <Calendar
                    dateFormat="dd-mm-yy"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.value)} // Call the date change handler
                />
            </div>
        </div>
    );

    return (
        <div className="card">
            <DataTable value={presences} header={header} globalFilter={globalFilter}>
                <Column field="employee_id" header="#ID" style={{ minWidth: '5%' }} />
                <Column field="employee_name" header="Nom" style={{ minWidth: '20%' }} />
                <Column field="status" header="Statut de présence" body={statutTemplate} style={{ minWidth: '15%' }} />
                <Column field="shift" header="Shift" body={shiftTemplate} style={{ minWidth: '10%' }} />
                <Column field="conge_id" header="Type" body={typeTemplate} style={{ minWidth: '10%' }} />
                <Column field="raison" header="Raison" body={raisonTemplate} style={{ minWidth: '15%' }} />
            </DataTable>
        </div>
    );
};

export default CreatePresencesDataTable;
