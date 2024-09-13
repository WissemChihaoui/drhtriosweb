import React,{useState,useRef, useEffect} from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DepartementDataTable from './DataTable/DepartementDataTable';
import AddDepartement from './Modals/AddDepartement';
import { Toast } from 'primereact/toast';

const Departements = ({ auth, departements }) => {
  const emptyProduct={
    id: null,
    nom_departement: "",
    fonctions: [{ name: "" }]
  }
const [product, setProduct] = useState(emptyProduct);
  
  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
console.log('show',product);
const hideDialog = () => {
  setSubmitted(false);
  setProductDialog(false);
  setProduct(emptyProduct)
};

  useEffect(() => {
    setProducts(departements);
    setProduct(emptyProduct)
}, [submitted]);

  return (
    <AuthenticatedLayout
      auth={auth}
      header={'Liste des départements'}
    >
      <Toast ref={toast} />
        <DepartementDataTable products={products} setProducts={setProducts} productDialog={productDialog} setProductDialog={setProductDialog} product={product} setProduct={setProduct}/>
        {productDialog && <AddDepartement productDialog={productDialog} hideDialog={hideDialog} toast={toast} submitted={submitted} product={product} setSubmitted={setSubmitted}/>}
    </AuthenticatedLayout>
    
  )
}

export default Departements