import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
        
import { Link, useForm } from '@inertiajs/react';
const PolyvalenceDataTable = ({employees}) => {
  
    let emptyProduct = {
        id: null,
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };
const {
    delete: destroy, 
    processing,      
    reset,         
} = useForm();
const {
    setData,post
} = useForm({ids: []})

    const [products, setProducts] = useState(employees);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(()=>{
        setProducts(employees)
    }, [employees])

   useEffect(() => {
       if(selectedProducts){
        const idsToDelete = selectedProducts.map((product) => product.id);
        setData({ids : idsToDelete})
       }
   }, [selectedProducts])
   

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

      // Function to get department name from department id
      const getDepartmentName = (id) => {
        const dept = departements.find(dep => dep.id === id);
        return dept ? dept.nom_departement : 'Unknown';
    };

    // Function to get contract name from contract id
    const getContractName = (employeeId) => {
        
        const employeeContract = employee_contracts.find(contract => {
            return contract.employee_id === employeeId;
            
        });
        
        if (employeeContract) {
            const contractType = contractsType.find(type => type.id === employeeContract.contract_id);
            return contractType ? contractType.name : 'Unknown';
        }
        return 'Unknown';
    };

 // Department Template
 const departmentBodyTemplate = (rowData) => {
    return getDepartmentName(rowData.polyvalences);
};

// Contract Template
const contractBodyTemplate = (rowData) => {
    return getContractName(rowData.id); // Get contract name based on employee id
};

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);  // Sets the selected product/employee
        setDeleteProductDialog(true);  
    };

    const deleteProduct = (e) => {
        e.preventDefault();
        // Use the `product.id` (which is set when you confirm delete)
        if (product && product.id) {
            // Inertia delete request
            destroy(route('workers.destroy', product.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setProducts(products.filter((productOld)=> productOld.id !== product.id))
                    closeModal();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employeé Deleted', life: 3000 });
                },  // Close modal if successful
                onError: () => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete employees', life: 3000 });
                },              
                onFinish: () => reset(),        // Reset form state on finish
            });
        }
    };

    // Method to close modal
    const closeModal = () => {
        setDeleteProductDialog(false);
    };
    


    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };
    

    

    const deleteSelectedProducts = () => {
        const idsToDelete = selectedProducts.map((product) => product.id);
        post(route('workers.deleteMultiple'),
        {
            method: 'post', // Ensure the method is specified as POST
            onSuccess: () => {
                setDeleteProductsDialog(false);
                setSelectedProducts(null);
                setProducts(products.filter((product) => !idsToDelete.includes(product.id)));
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employees Deleted', life: 3000 });
            },
            onError: () => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete employees', life: 3000 });
            },
            onFinish: () => reset(),
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                 <Link href={route('worker.add.page')} >
                    <Button>
                        Ajouter employée
                    </Button>
                </Link>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between "><Button size='small' label="Exporter" icon="ti ti-upload" onClick={exportCSV} className="p-button-help"/>{header}</div>;
    };

   

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="ti ti-pencil" className="mr-2" rounded outlined  onClick={() => editProduct(rowData)} />
            </React.Fragment>
        );
    };


    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between ">
            <InputText  type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." />
        </div>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Non" className='mr-1' icon="ti ti-circle-x" outlined onClick={hideDeleteProductDialog} />
            <Button label="Oui" icon="ti ti-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Non" className='mr-1' icon="ti ti-circle-x" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Oui"icon="ti ti-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    const polyvalencesTemplate = (rowData) => {
        return (
            <ul className='flex flex-wrap'>
            { rowData.polyvalences.map((polyvalence, index)=> (
                <li className='mx-1'  key={index}>
                    <Link>
                        <Chip label={polyvalence.name} />
                    </Link>
                </li>
            ))}
            </ul>
        )
    }

   

    return (
        <div>
            <Toast ref={toast} />
            <div className="card ">
                <Toolbar className="mb-4 dark:bg-gray-800" left={leftToolbarTemplate} right={rightToolbarTemplate} />

                <DataTable
                    ref={dt}
                    value={products}
                    selection={selectedProducts}
                    onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Affichage de {first} à {last} des employées de {totalRecords}."
                    emptyMessage='Pas de données'
                    globalFilter={globalFilter}
                >
                    <Column className='dark:bg-gray-800 dark:text-gray-200' field="id" header="Id" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column className='dark:bg-gray-800 dark:text-gray-200' field="name" header="Nom" sortable style={{ minWidth: '14rem' }}></Column>
                    <Column className='dark:bg-gray-800 dark:text-gray-200' header="Machine" body={polyvalencesTemplate} sortable style={{ minWidth: '18rem' }}></Column>
                    <Column className='dark:bg-gray-800 dark:text-gray-200' body={actionBodyTemplate} exportable={false} style={{ minWidth: '4rem' }}></Column>
                </DataTable>
            </div>

           
            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Supprimer employeé" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="ti ti-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Êtes-vous sûr de vouloir supprimer <b>{product.nom}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmer la suppression" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="ti ti-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Êtes-vous sûr de vouloir supprimer les employées sélectionnés?</span>}
                </div>
            </Dialog>
        </div>
    );

}

export default PolyvalenceDataTable