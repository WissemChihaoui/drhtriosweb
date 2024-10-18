import React, { useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { SelectButton } from 'primereact/selectbutton'
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputSwitch } from 'primereact/inputswitch';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toast } from 'primereact/toast';
import { useForm } from "@inertiajs/react";
const AddWorker = ({ auth, mustVerifyEmail, status, employees, departements,contractsType, type_salairs, polyvalences, categories }) => {
    
    
    
    const stepperRef = useRef(null);
    const genderOptions = ['Homme', 'Femme'];
    
    const toast = useRef(null);
  
    
    const { post, setData, data, errors } = useForm({
        // Personal details
        name: '',
        birthdate: null,  // Assuming you're using a Date object
        employeeID: null,  // Assuming you're using a Date object
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
        exit_date: null,   // Assuming you're using a Date object
        start_date: null, // Assuming you're using a Date object
        end_date: null,   // Assuming you're using a Date object
        salary_type: null, // or a default value from salaryTypes
        salary: '',
    
        // Files
        resume: null,     // Or handle it based on file input requirements
        document: null,   // Or handle it based on file input requirements
        cin: null,        // Or handle it based on file input requirements
    
        // Polyvalences
        polyvalence: []
    });
    console.log('data', data);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const [filteredFonctions, setFilteredFonctions] = useState([]);
    // Handle special input (Calendar, Dropdown, etc.)
    const handleDropdownChange = (name, value) => {
        console.log(value)
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        if (name === 'departement') {
            console.log('After Pick',departements);
            
            // Find the selected department and get its fonctions
            const selectedDepartment = departements.find(dep => dep.id === value);
            const fonctionsForDepartement = selectedDepartment ? selectedDepartment.fonctions : [];
            setFilteredFonctions(fonctionsForDepartement);
            setData((prevData) => ({
                ...prevData,
                fonction: null // Reset fonction when department changes
            }));
        }
    };

   
    const handlePolyvalenceChange = (id, checked) => {
        setData((prevData) => {
            let updatedPolyvalence;
    
            if (checked) {
                // Add the ID if it's checked and not already in the array
                updatedPolyvalence = [...prevData.polyvalence, id];
            } else {
                // Remove the ID if it's unchecked
                updatedPolyvalence = prevData.polyvalence.filter(polyId => polyId !== id);
            }
    
            return {
                ...prevData,
                polyvalence: updatedPolyvalence, // Update polyvalence with the array of selected IDs
            };
        });
    };
    
    const handleFileSelect = (event) => {
        console.log(event.options.props.id);
        
        console.log('Selected file:', event.files[0]);

        setData((prevData) => ({
            ...prevData,
            [event.options.props.id]: event.files[0],
        }))
    };
    

    const handleSubmit = () => {
       
        post(route('add.worker'), {
            onError: (error) => {
                console.log(error);
            },
            onSuccess: () => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Worker added successfully.',
                    life: 3000
                });
            }
        });
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
                                        name="name" value={data.name} onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="birthdate">Date de naissance</label>
                                    <Calendar  id="birthdate" name="birthdate" value={data.birthdate} onChange={(e) => handleDropdownChange('birthdate', e.value)}/>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="birthdate">Genre</label>
                                    <SelectButton value={data.gender} options={genderOptions} onChange={(e) => handleDropdownChange('gender', e.value)}/>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="phone">Numéro de téléphone</label>
                                    <InputMask id="phone" name="phone" value={data.phone} onChange={handleChange} mask="(99) 999-999" placeholder="(99) 999-999"></InputMask>
                                </div>
                                <div className="flex flex-column gap-2 md:col-span-2 lg:col-span-4">
                                    <label htmlFor="adress">Adresse</label>
                                    <InputTextarea id="adress" autoResize  rows={5} name="address" value={data.address} onChange={handleChange}/>
                        
                                </div>
                                <div className="flex flex-column gap-2 lg:col-span-2">
                                    <label htmlFor="mail">Email</label>
                                    <InputText
                                        id="mail"
                                        aria-describedby="username-help"
                                        name="email" value={data.email} onChange={handleChange} 
                                    />
                                    
                                </div>
                                <div className="flex flex-column gap-2 lg:col-span-2">
                                    <label htmlFor="mail">Catégorie</label>
                                    <Dropdown value={data.category} options={categories} optionLabel="name" optionValue="id" placeholder="Choisir Catégorie" onChange={(e) => handleDropdownChange('category', e.value)}  />
                                </div>
                            </div>
                        </div>
                        <div className="flex py-4">
                            <Button
                                label="Suivant"
                                icon="ti ti-arrow-down"
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
                                    <label htmlFor="employeeID">Id Employé</label>
                                    <InputText
                                        id="employeeID"
                                        aria-describedby="username-help"
                                        invalid
                                    />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="departement">Départment</label>
                                    <Dropdown id="departement" value={data.departement} options={departements} optionValue="id" optionLabel="nom_departement" placeholder="Choisir Département" onChange={(e) => handleDropdownChange('departement', e.value)}  />
                                    
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="fonction">Fonction</label>
                                    <Dropdown id="fonction" value={data.fonction} options={filteredFonctions} optionValue="id" optionLabel="name" placeholder="Choisir Fonction" onChange={(e) => handleDropdownChange('fonction', e.value)}  />
                                    
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="contract">Contrat</label>
                                    <Dropdown id="contract" value={data.contract} options={contractsType} optionLabel="name" optionValue="id" placeholder="Choisir Contrat" onChange={(e) => handleDropdownChange('contract', e.value)}  />
                                    
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="embauche">Date d'embauche</label>
                                    <Calendar  id="embauche" name="embauche" value={data.embauche} onChange={(e) => handleDropdownChange('embauche', e.value)}/>
                                    
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="start_date">Date de début de contrat</label>
                                    <Calendar  id="start_date" name="start_date" value={data.start_date} onChange={(e) => handleDropdownChange('start_date', e.value)}/>
                                    
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="end_date">Date de fin de contrat</label>
                                    <Calendar  id="end_date" name="end_date" value={data.end_date} onChange={(e) => handleDropdownChange('end_date', e.value)}/>
                                    
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="salary_type">Type de salaire</label>
                                    <Dropdown id="salary_type" name="salary_type" onChange={(e) => handleDropdownChange('salary_type', e.value)} value={data.salary_type}  options={type_salairs} optionLabel="type" optionValue="id" placeholder="Choisir Contrat" className="w-full md:w-14rem" />
                                    
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="salary">Salaire</label>
                                    <div className="p-inputgroup flex-1">
                                        <InputText  name="salary" value={data.salary} onChange={handleChange} />
                                        <span className="p-inputgroup-addon">TND</span>
                                    </div>
                                    
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
                                   
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="document">Document</label>
                                    <Toast ref={toast}></Toast>
                                    <FileUpload uploadHandler={handleFileSelect} auto   id="document" mode="basic"  accept="image/*" maxFileSize={1000000} customUpload />
                                    
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="cin">CIN</label>
                                    <Toast ref={toast}></Toast>
                                    <FileUpload uploadHandler={handleFileSelect}  auto  id="cin" mode="basic"  accept="image/*" maxFileSize={1000000} customUpload />
                                    
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
                                onClick={() =>
                                    stepperRef.current.nextCallback()
                                }
                            />
                        </div>
                    </StepperPanel>
                    <StepperPanel header="Polyvalence">
                    <div className="flex flex-column">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                            {polyvalences.map((polyvalence) => (
                                <div className="flex flex-column gap-2" key={polyvalence.id}>
                                    <label htmlFor={`polyvalence-${polyvalence.id}`}>{polyvalence.name}</label>
                                    <InputSwitch
                                        id={polyvalence.id}
                                        checked={data.polyvalence.includes(polyvalence.id)} // Check if the ID is in the array
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
                            />
                        </div>
                    </StepperPanel>
                </Stepper>
            </div>
        </AuthenticatedLayout>
    );
};

export default AddWorker;
