import React, { useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { SelectButton } from 'primereact/selectbutton'
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputSwitch } from 'primereact/inputswitch';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toast } from 'primereact/toast';
import { useForm } from "@inertiajs/react";
const AddWorker = ({ auth, mustVerifyEmail, status, employees }) => {
    
    const stepperRef = useRef(null);
    const genderOptions = ['Homme', 'Femme'];
    
    const toast = useRef(null);
    
    const categories = [
        { name: 'categorie 1', code: '1' },
        { name: 'categorie 2', code: '2' },
        { name: 'categorie 3', code: '3' },
        { name: 'categorie 4', code: '4' },
        { name: 'categorie 5', code: '5' }
    ];
    const depatements = [
        { name: 'departement 1', code: '1' },
        { name: 'departement 2', code: '2' },
        { name: 'departement 3', code: '3' },
        { name: 'departement 4', code: '4' },
        { name: 'departement 5', code: '5' }
    ];
    const fonctions = [
        { name: 'fonctions 1', code: '1' },
        { name: 'fonctions 2', code: '2' },
        { name: 'fonctions 3', code: '3' },
        { name: 'fonctions 4', code: '4' },
        { name: 'fonctions 5', code: '5' }
    ];
    const contracts = [
        { name: 'contracts 1', code: '1' },
        { name: 'contracts 2', code: '2' },
        { name: 'contracts 3', code: '3' },
        { name: 'contracts 4', code: '4' },
        { name: 'contracts 5', code: '5' }
    ];
    const salaryTypes = [
        { name: 'salaryTypes 1', code: '1' },
        { name: 'salaryTypes 2', code: '2' },
        { name: 'salaryTypes 3', code: '3' },
        { name: 'salaryTypes 4', code: '4' },
        { name: 'salaryTypes 5', code: '5' }
    ];
    const polyvalences =[
        {label: 'surjet 1', id:'1'},
        {label: 'surjet 2', id:'2'},
        {label: 'surjet 3', id:'3'},
        {label: 'surjet 4', id:'4'},
    ]
    const { post, setData, data } = useForm({
        // Personal details
        name: '',
        birthdate: null,  // Assuming you're using a Date object
        gender: null,     // or a default value from genderOptions
        phone: '',
        address: '',
        email: '',
        category: null,  // or a default value from categories
    
        // Company details
        departement: null, // or a default value from depatements
        fonction: null,   // or a default value from fonctions
        contract: null,   // or a default value from contracts
        embauche: null,   // Assuming you're using a Date object
        start_date: null, // Assuming you're using a Date object
        end_date: null,   // Assuming you're using a Date object
        salary_type: null, // or a default value from salaryTypes
        salary: '',
    
        // Files
        resume: null,     // Or handle it based on file input requirements
        document: null,   // Or handle it based on file input requirements
        cin: null,        // Or handle it based on file input requirements
    
        // Polyvalences
        polyvalence: polyvalences.reduce((acc, curr) => {
            acc[curr.id] = false; // Initialize all polyvalence IDs with false
            return acc;
        }, {})
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle special input (Calendar, Dropdown, etc.)
    const handleDropdownChange = (name, value) => {
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

   
    const handlePolyvalenceChange = (id, checked) => {
        setData((prevData) => ({
            ...prevData,
            polyvalence: {
                ...prevData.polyvalence,
                [id]: checked, // Update the state for specific polyvalence id
            },
        }));
    };
    const handleFileSelect = (event) => {
        console.log(event.options.props.id);
        
        console.log('Selected file:', event.files[0]);

        setData((prevData) => ({
            ...prevData,
            [event.options.props.id]: event.files[0],
        }))
    };
    

    // Handle form submission
    const handleSubmit = () => {
        console.log("Form Data Submitted:", data);
        post(route('add.worker'))
    };

   
    return (
        <AuthenticatedLayout auth={auth} header={"Ajouter un employée"}>
            <div className="card">
                <Stepper
                    ref={stepperRef}
                    style={{ flexBasis: "50rem" }}
                    orientation="vertical"
                >
                    <StepperPanel header="Détails personnels">
                        <div className="flex flex-column">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="name">Nom</label>
                                    <InputText
                                        id="name"
                                        aria-describedby="username-help"
                                        invalid
                                        name="name" value={data.name} onChange={handleChange}
                                    />
                                    <small className="text-red-500" id="username-help">
                                        Nom d'employée est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="birthdate">Date de naissance</label>
                                    <Calendar  id="birthdate" name="birthdate" value={data.birthdate} onChange={(e) => handleDropdownChange('birthdate', e.value)}/>
                                    <small className="text-red-500" id="username-help">
                                        Date de naissance est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="birthdate">Genre</label>
                                    <SelectButton value={data.gender} options={genderOptions} onChange={(e) => handleDropdownChange('gender', e.value)}/>
                                    <small className="text-red-500" id="username-help">
                                        Genre est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="phone">Numéro de téléphone</label>
                                    <InputMask id="phone" name="phone" value={data.phone} onChange={handleChange} mask="(99) 999-999" placeholder="(99) 999-999"></InputMask>
                                    <small className="text-red-500" id="username-help">
                                        Numéro de téléphone est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2 md:col-span-2 lg:col-span-4">
                                    <label htmlFor="adress">Adresse</label>
                                    <InputTextarea id="adress" autoResize  rows={5} name="address" value={data.address} onChange={handleChange}/>
                                    <small className="text-red-500" id="username-help">
                                    Adresse est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2 lg:col-span-2">
                                    <label htmlFor="mail">Email</label>
                                    <InputText
                                        id="mail"
                                        aria-describedby="username-help"
                                        name="email" value={data.email} onChange={handleChange} 
                                    />
                                    <small className="text-red-500" id="username-help">
                                        Email est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2 lg:col-span-2">
                                    <label htmlFor="mail">Catégorie</label>
                                    <Dropdown value={data.category} options={categories} optionLabel="name" placeholder="Choisir Catégorie" onChange={(e) => handleDropdownChange('category', e.value)} className="w-full md:w-14rem" />
                                    
                                    <small className="text-red-500" id="username-help">
                                        Catégorie est requis
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="flex py-4">
                            <Button
                                label="Suivant"
                                icon="ti ti-arrow-down"
                                className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                                iconPos="right"
                                onClick={() =>
                                    stepperRef.current.nextCallback()
                                }
                            />
                        </div>
                    </StepperPanel>
                    <StepperPanel header="Détails de l'entreprise">
                    <div className="flex flex-column">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="id_emp">Id Employé</label>
                                    <InputText
                                        id="id_emp"
                                        aria-describedby="username-help"
                                        invalid
                                        disabled
                                    />
                                    <small className="text-red-500" id="username-help">
                                    Id Employé est génerer
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="departement">Départment</label>
                                    <Dropdown id="departement" value={data.departement} options={depatements} optionLabel="name" placeholder="Choisir Département" onChange={(e) => handleDropdownChange('departement', e.value)} className="w-full md:w-14rem" />
                                    <small className="text-red-500" id="username-help">
                                        Départment est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="fonction">Fonction</label>
                                    <Dropdown id="fonction" value={data.fonction} options={fonctions} optionLabel="name" placeholder="Choisir Fonction" onChange={(e) => handleDropdownChange('fonction', e.value)} className="w-full md:w-14rem" />
                                    <small className="text-red-500" id="username-help">
                                        Fonction est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="contract">Contrat</label>
                                    <Dropdown id="contract" value={data.contract} options={contracts} optionLabel="name" placeholder="Choisir Contrat" onChange={(e) => handleDropdownChange('contract', e.value)} className="w-full md:w-14rem" />
                                    <small className="text-red-500" id="username-help">
                                        Contrat est requis
                                    </small>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="embauche">Date d'embauche</label>
                                    <Calendar  id="embauche" name="embauche" value={data.embauche} onChange={(e) => handleDropdownChange('embauche', e.value)}/>
                                    <small className="text-red-500" id="username-help">
                                        Date d'embauche est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="start_date">Date de début de contrat</label>
                                    <Calendar  id="start_date" name="start_date" value={data.start_date} onChange={(e) => handleDropdownChange('start_date', e.value)}/>
                                    <small className="text-red-500" id="username-help">
                                        Date de début de contrat est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="end_date">Date de fin de contrat</label>
                                    <Calendar  id="end_date" name="end_date" value={data.end_date} onChange={(e) => handleDropdownChange('end_date', e.value)}/>
                                    <small className="text-red-500" id="username-help">
                                        Date de fin de contrat est requis
                                    </small>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="salary_type">Type de salaire</label>
                                    <Dropdown id="salary_type" name="salary_type" onChange={(e) => handleDropdownChange('salary_type', e.value)} value={data.salary_type}  options={salaryTypes} optionLabel="name" placeholder="Choisir Contrat" className="w-full md:w-14rem" />
                                    <small className="text-red-500" id="username-help">
                                    Type de salaire est requis
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="salary">Salaire</label>
                                    <div className="p-inputgroup flex-1">
                                        <InputText  name="salary" value={data.salary} onChange={handleChange} />
                                        <span className="p-inputgroup-addon">TND</span>
                                    </div>
                                    <small className="text-red-500" id="username-help">
                                    Salaire est génerer
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="flex py-4 gap-2">
                            <Button
                                label="Retour"
                                severity="secondary"
                                icon="ti ti-arrow-up"
                                onClick={() =>
                                    stepperRef.current.prevCallback()
                                }
                            />
                            <Button
                                label="Suivant"
                                icon="ti ti-arrow-down"
                                className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                                onClick={() =>
                                    stepperRef.current.nextCallback()
                                }
                            />
                        </div>
                    </StepperPanel>
                    <StepperPanel header="Documents">
                    <div className="flex flex-column">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="resume">CV</label>
                                    <Toast ref={toast}></Toast>
                                    <FileUpload uploadHandler={handleFileSelect} auto   id="resume"  mode="basic"  accept="image/*" maxFileSize={1000000} customUpload />
                                    <small className="text-red-500" id="username-help">
                                        Ce document est pas télécharger!
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="document">Document</label>
                                    <Toast ref={toast}></Toast>
                                    <FileUpload uploadHandler={handleFileSelect} auto   id="document" mode="basic"  accept="image/*" maxFileSize={1000000} customUpload />
                                    <small className="text-red-500" id="username-help">
                                        Ce document est pas télécharger!
                                    </small>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="cin">CIN</label>
                                    <Toast ref={toast}></Toast>
                                    <FileUpload uploadHandler={handleFileSelect}  auto  id="cin" mode="basic"  accept="image/*" maxFileSize={1000000} customUpload />
                                    <small className="text-red-500" id="username-help">
                                        Ce document est pas télécharger!
                                    </small>
                                </div>
                                
                            </div>
                        </div>
                        <div className="flex py-4 gap-2">
                            <Button
                                label="Retour"
                                severity="secondary"
                                icon="ti ti-arrow-up"
                                onClick={() =>
                                    stepperRef.current.prevCallback()
                                }
                            />
                            <Button
                                label="Suivant"
                                icon="ti ti-arrow-down"
                                className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                                onClick={() =>
                                    stepperRef.current.nextCallback()
                                }
                            />
                        </div>
                    </StepperPanel>
                    <StepperPanel header="Polyvalence">
                    <div className="flex flex-column">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                                {polyvalences.map((polyvalence)=> (
                                    <div className="flex flex-column gap-2" key={polyvalence.id}>
                                     <label htmlFor={`polyvalence-${polyvalence.id}`}>{polyvalence.label}</label>
                                    <InputSwitch
                                        id={`polyvalence-${polyvalence.id}`}
                                        checked={data.polyvalence[polyvalence.id] || false}
                                        onChange={(e) => handlePolyvalenceChange(polyvalence.id, e.value)}
                                    />
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex py-4 gap-2">
                            <Button
                                label="Retour"
                                severity="secondary"
                                icon="ti ti-arrow-up"
                                onClick={() =>
                                    stepperRef.current.prevCallback()
                                }
                            />
                            <Button
                                onClick={handleSubmit}
                                label="Ajouter"
                                icon="ti ti-check"
                                className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                            />
                        </div>
                    </StepperPanel>
                </Stepper>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddWorker;
