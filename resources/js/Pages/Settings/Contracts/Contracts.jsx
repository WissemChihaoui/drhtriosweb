import React, { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toast } from "primereact/toast";
import ContractsDataTable from "./DataTable/ContractsDataTable";
import AddContract from "./Modals/AddContract";

const Contracts = ({auth, contracts}) => {
    const emptyContracts = {
        id: null,
        name: "",
    };
    const [contractsData, setContractsData] = useState(null);
    const [contract, setContract] = useState(emptyContracts);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setContract(emptyContracts);
    };

    console.log( 'from Parent',contract);
    

    useEffect(() => {
        setContractsData(contracts);
        setContract(emptyContracts);
    }, [submitted]);
    
  return (
    <AuthenticatedLayout auth={auth} header={"Liste des types de contracts"}>
        <Toast ref={toast} />
        <ContractsDataTable 
            products={contractsData}
            setProducts={setContractsData}
            productDialog={productDialog}
            setProductDialog={setProductDialog}
            product={contract}
            setProduct={setContract}
        />
        <AddContract 
            productDialog={productDialog}
            hideDialog={hideDialog}
            toast={toast}
            submitted={submitted}
            product={contract}
            setSubmitted={setSubmitted}
        />
    </AuthenticatedLayout>
  )
}

export default Contracts