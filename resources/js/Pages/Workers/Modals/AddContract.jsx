import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { data } from "autoprefixer";
import { useForm } from "@inertiajs/react";

const AddContract = ({ openContractModal, openContract, id, contractsType, type_salairs   }) => {
    const { data, setData, post } = useForm({
        id: id,
        embauche: null,
        start_date:null,
        end_date:null,
        contract:null,
        salary_type: null,
        salary: null
    })
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleDropdownChange = (name, value) => {
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const submitContrat = ()=> {
        console.log(data);
        post(route('add.worker.contract',data.id),{
            data:data,
            onSuccess:()=>{
                openContract()
            }
        })
        
    }
    const addContractFooter = () => {
        return(
            <>
            <Button className="mr-2" label="Annuler" severity="secondary" onClick={openContract} />
            <Button label="Enregistrer" severity="primary" onClick={submitContrat} />
            </>
        )
    }
    return (
        <Dialog footer={addContractFooter}  header="Ajouter Contrat" visible={openContractModal} style={{ width: '50vw' }} onHide={openContract}>
            <div className="flex flex-col">
                <div className="flex flex-col gap-2 mb-2">
                    <label htmlFor="contract">Contrat</label>
                    <Dropdown
                        id="contract"
                        value={data.contract}
                        options={contractsType}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Choisir Contrat"
                        onChange={(e) =>
                            handleDropdownChange("contract", e.value)
                        }
                    />
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <label htmlFor="embauche">Date d'embauche</label>
                    <Calendar
                        id="embauche"
                        name="embauche"
                        value={data.embauche}
                        onChange={(e) =>
                            handleDropdownChange("embauche", e.value)
                        }
                    />
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <label htmlFor="start_date">Date de début de contrat</label>
                    <Calendar
                        id="start_date"
                        name="start_date"
                        value={data.start_date}
                        onChange={(e) =>
                            handleDropdownChange("start_date", e.value)
                        }
                    />
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <label htmlFor="end_date">Date de fin de contrat</label>
                    <Calendar
                        id="end_date"
                        name="end_date"
                        value={data.end_date}
                        onChange={(e) =>
                            handleDropdownChange("end_date", e.value)
                        }
                    />
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <label htmlFor="salary_type">Type de salaire</label>
                    <Dropdown
                        id="salary_type"
                        name="salary_type"
                        onChange={(e) =>
                            handleDropdownChange("salary_type", e.value)
                        }
                        value={data.salary_type}
                        options={type_salairs}
                        optionLabel="type"
                        optionValue="id"
                        placeholder="Choisir Contrat"
                        className="w-full md:w-14rem"
                    />
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <label htmlFor="salary">Salaire</label>
                    <div className="p-inputgroup flex-1">
                        <InputText
                            name="salary"
                            value={data.salary}
                            onChange={handleChange}
                        />
                        <span className="p-inputgroup-addon">TND</span>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default AddContract;
