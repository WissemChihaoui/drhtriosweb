import React, { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toast } from "primereact/toast";
import CongesDataTable from "./DataTable/CongesDataTable";
import AddConge from "./Modals/AddConge";

const Conges = ({auth, conges}) => {
    console.log(conges);
    const emptyConge = {
      id: null,
      nom_conge: "",
  };
  const [congesData, setCongesData] = useState(null);
  const [conge, setConge] = useState(emptyConge);
  const [productDialog, setProductDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const hideDialog = () => {
      setSubmitted(false);
      setProductDialog(false);
      setConge(emptyConge);
  };

  useEffect(() => {
    setCongesData(conges);
    setConge(emptyConge);
}, [submitted]);

    
  return (
    <AuthenticatedLayout auth={auth} header={"Liste de types des congés"}>
      <Toast ref={toast} />
      <CongesDataTable 
        products={congesData}
        setProducts={setCongesData}
        productDialog={productDialog}
        setProductDialog={setProductDialog}
        product={conge}
        setProduct={setConge}
      />
      {
        productDialog && 
        <AddConge 
          productDialog={productDialog}
          hideDialog={hideDialog}
          toast={toast}
          submitted={submitted}
          product={conge}
          setSubmitted={setSubmitted}
        />
      }
    </AuthenticatedLayout>
  )
}

export default Conges