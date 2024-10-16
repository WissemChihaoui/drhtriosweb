import React, { useEffect, useRef, useState } from "react";
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
import ToolbarField from "./Partials/Toolbar";
import { Dialog } from "primereact/dialog";
import AddContract from "./Modals/AddContract";
        

const EditWorker = ({auth,employee, categories, departements, contractsType, type_salairs, polyvalences, employee_contracts}) => {
    console.log(employee_contracts);
    const [isCurrentContractEnd, setIsCurrentContractEnd] = useState();
    const [filteredFonctions, setFilteredFonctions] = useState([]);
    const [openContractModal, setOpenContractModal] = useState(false);
    const stepperRef = useRef(null);
    const toast = useRef(null);

    const genderOptions = ['Homme', 'Femme'];
    const [currentContract, setCurrentContract] = useState(employee_contracts[employee_contracts.length-1])
    
    const { post, setData, data, errors } = useForm({
        // Personal details
        id: employee.id,
        name: employee.name,
        birthdate: new Date(employee.birthdate),  // Assuming you're using a Date object
        gender: employee.gender,     // or a default value from genderOptions
        phone: employee.phone,
        address: employee.address,
        email: employee.email,
        category: employee.category_id,  // or a default value from categories
        commentaire: employee.commentaire,
        status: employee.status,
        employeeID: employee.employeeID,
        // Company details
        departement: employee.id_departement, // or a default value from depatements
        fonction: employee.id_fonction,   // or a default value from fonctions
        contract: currentContract.contract_id ?? null,   // or a default value from contracts
        embauche: new Date(currentContract.hire_date),   // Assuming you're using a Date object
        start_date: new Date(currentContract.contract_start_date), // Assuming you're using a Date object
        end_date: new Date(currentContract.contract_end_date),   // Assuming you're using a Date object
        salary_type: currentContract.salary_type_id, // or a default value from salaryTypes
        salary: currentContract.amount,
    
        // Files
        resume: null,     // Or handle it based on file input requirements
        document: null,   // Or handle it based on file input requirements
        cin: null,        // Or handle it based on file input requirements
    
        // Polyvalences
        polyvalences: employee.polyvalences.map((poly) => (poly.id)) || [],
    });
    const toastContract = useRef();
    const [newContract, setNewContract] = useState({
        id: data.id,
        embauche: null,
        start_date:null,
        end_date:null,
        contract:null,
        salary_type: null,
        salary: null
    })
    useEffect(() => {
        if (data?.end_date) {
            const endDate = new Date(data.end_date);
            const today = new Date();
            endDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            setIsCurrentContractEnd(endDate < today);
        }
        
    }, [data.end_date]);
    useEffect(()=> {
        if(isCurrentContractEnd){
            toastContract.current.show({ severity: 'warn', summary: 'Le contrat a atteint son terme ', detail: 'Le contrat de cet employée a atteint son terme. Veuillez ajouter un autre', sticky: true })
            setData((prevContract)=> ({
                ...prevContract,
                embauche: null,
                start_date:null,
                end_date:null,
                contract:null,
                salary_type: null,
                salary: null
            }))
        }
    }, [isCurrentContractEnd])
    console.log(isCurrentContractEnd)

    const openContract = () => {
        setOpenContractModal(!openContractModal);
    }
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileSelect = (event) => {
        setData((prevData) => ({
            ...prevData,
            [event.options.props.id]: event.files[0],
        }))
    };

    useEffect(()=>{
        if (data.departement){
            const selectedDepartment = departements.find(dep => dep.id === data.departement);
            const fonctionsForDepartement = selectedDepartment ? selectedDepartment.fonctions : [];
            setFilteredFonctions(fonctionsForDepartement);
        }
    },[data.departement])

    const handleDropdownChange = (name, value) => {
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    
    };
    const handlePolyvalenceChange = (id, checked) => {
        setData((prevData) => {
            let updatedPolyvalence;
    
            if (checked) {
                // Add the ID if it's checked and not already in the array
                updatedPolyvalence = [...prevData.polyvalences, id];
            } else {
                // Remove the ID if it's unchecked
                updatedPolyvalence = prevData.polyvalences.filter(polyId => polyId !== id);
            }
    
            return {
                ...prevData,
                polyvalences: updatedPolyvalence, // Update polyvalence with the array of selected IDs
            };
        });
    };
    
    
    const handleSubmit = () => {
        post(route('edit.worker',data.id),{
            onError: (error) => {
                console.log(error);
            },
            onSuccess: () => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Mis à jour d"employée a été effectué.',
                    life: 3000
                });
            }
        })
        console.log(data)
    }
    

    

    
    return (
        <AuthenticatedLayout auth={auth} header={`Modifier l'employée #${data.id}`}>
            <Toast ref={toastContract} position="center"/>
            <ToolbarField product={data} setData={setData} handleSubmit={handleSubmit} employee_contracts={employee_contracts} contractsType={contractsType} type_salairs={type_salairs} />
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
                                <div className="flex flex-column gap-2 md:col-span-2 lg:col-span-4">
                                    <label htmlFor="commentaire">Commentaire</label>
                                    <InputTextarea id="commentaire" autoResize  rows={5} name="commentaire" value={data.commentaire} onChange={handleChange}/>
                                    
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
                            <Button label='Enregistrer' icon="ti ti-check" className="ml-2" onClick={()=>handleSubmit()}/>
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
                                        disabled
                                        value={data.id}
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
                                {/* {!isCurrentContractEnd ? <div className="flex flex-column gap-2">
                                    <label htmlFor="contract">Contrat</label>
                                    <Dropdown disabled={!isCurrentContractEnd} id="contract" value={data.contract} options={contractsType} optionLabel="name" optionValue="id" placeholder="Choisir Contrat" onChange={(e) => handleDropdownChange('contract', e.value)}  />
                                   
                                </div> : <Button label="Ajouter Contrat" />} */}
                                
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="contract">Contrat</label>
                                        {
                                            isCurrentContractEnd ? <Button label="Ajouter Contrat" onClick={openContract}/> :(
                                                <Dropdown disabled={!isCurrentContractEnd} id="contract" value={data.contract} options={contractsType} optionLabel="name" optionValue="id" placeholder="Choisir Contrat" onChange={(e) => handleDropdownChange('contract', e.value)}  />
                                            )
                                        }
                                    </div>
                                </div>
                            
                            {!isCurrentContractEnd && <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="embauche">Date d'embauche</label>
                                    <Calendar disabled={!isCurrentContractEnd} id="embauche" name="embauche" value={data.embauche} onChange={(e) => handleDropdownChange('embauche', e.value)}/>
                                    
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="start_date">Date de début de contrat</label>
                                    <Calendar disabled={!isCurrentContractEnd} id="start_date" name="start_date" value={data.start_date} onChange={(e) => handleDropdownChange('start_date', e.value)}/>
                                    
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
                            </>}
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
                            <Button label='Enregistrer' icon="ti ti-check" className="ml-2" onClick={()=>handleSubmit()}/>
                        </div>
                    </StepperPanel>
                    <StepperPanel header="Documents">
                    <div className="flex flex-column">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4">
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="resume">CV</label>
                                    <Toast ref={toast}></Toast>
                                    <FileUpload uploadHandler={handleFileSelect} auto   id="resume"  mode="basic"  accept="image/*" maxFileSize={1000000} customUpload />
                                    <a size="small" className="text-xs" href={`/storage/${employee.resume}`} target="_blank">Voir le fichier <i className="ti ti-file"></i></a>
                                    
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="document">Document</label>
                                    <Toast ref={toast}></Toast>
                                    <FileUpload uploadHandler={handleFileSelect} auto   id="document" mode="basic"  accept="image/*" maxFileSize={1000000} customUpload />
                                    <a size="small" className="text-xs" href={`/storage/${employee.document}`} target="_blank">Voir le fichier <i className="ti ti-file"></i></a>
                                    
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="cin">CIN</label>
                                    <Toast ref={toast}></Toast>
                                    <FileUpload uploadHandler={handleFileSelect}  auto  id="cin" mode="basic"  accept="image/*" maxFileSize={1000000} customUpload />
                                    <a size="small" className="text-xs" href={`/storage/${employee.cin}`} target="_blank">Voir le fichier <i className="ti ti-file"></i></a>
                                   
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
                            <Button label='Enregistrer' icon="ti ti-check" className="ml-2" onClick={()=>handleSubmit()}/>
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
                                        checked={data.polyvalences.includes(polyvalence.id)} // Check if the ID is in the array
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
                            <Button label='Enregistrer' icon="ti ti-check" className="ml-2" onClick={()=>handleSubmit()}/>
                            
                        </div>
                    </StepperPanel>
                </Stepper>

               <AddContract openContractModal={openContractModal} openContract={openContract} id={data.id} contractsType ={contractsType} type_salairs ={type_salairs }/>
            </div>
        </AuthenticatedLayout>
    );
}

export default EditWorker