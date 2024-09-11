import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Link, useForm } from '@inertiajs/react';

export default function WorkersDataTable({employees}) {
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

   useEffect(() => {
       if(selectedProducts){
        const idsToDelete = selectedProducts.map((product) => product.id);
        console.log('ids to delete:',idsToDelete);
        setData({ids : idsToDelete})
       }
   }, [selectedProducts])
   

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
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
                    closeModal()
                },  // Close modal if successful
                onError: () => {},              // Handle errors (optional)
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
                <Link href={route('worker.add.page')} className='btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white'>Ajouter employée</Link>
                <Button className='btn bg-red-900 text-red-100 hover:bg-red-800 dark:bg-red-100 dark:text-red-800 dark:hover:bg-white' label="Supprimer" icon="ti ti-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between "><Button label="Exporter" icon="ti ti-upload" className="p-button-help bg-violet-400 px-2 text-white" onClick={exportCSV} />{header}</div>;
    };

    const statusBodyTemplate = (rowData) => {
        return  rowData.statut === "1" ? <Tag value="active" severity='success'></Tag> : <Tag value="inactive" severity='danger'></Tag> ;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="ti ti-pencil" rounded outlined className="mr-2 bg-orange-400" onClick={() => editProduct(rowData)} />
                <Button icon="ti ti-trash" rounded outlined severity="danger" className='bg-red-500' onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };


    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between ">
            
                <InputText  type="search" className='"p-inputtext-sm' onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." />
            
        </div>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Non" icon="ti ti-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Oui" icon="ti ti-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Non" icon="ti ti-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Oui" icon="ti ti-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card dark:bg-gray-800">
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
                    globalFilter={globalFilter}
                >
                    <Column className='dark:bg-gray-800 dark:text-gray-200' selectionMode="multiple" exportable={false}></Column>
                    <Column className='dark:bg-gray-800 dark:text-gray-200' field="id" header="Id" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column className='dark:bg-gray-800 dark:text-gray-200' field="nom" header="Nom" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column className='dark:bg-gray-800 dark:text-gray-200' field="id_departement" header="Département" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column className='dark:bg-gray-800 dark:text-gray-200' field="categorie" header="Contrat" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column className='dark:bg-gray-800 dark:text-gray-200' field="statut" header="Statut" body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column className='dark:bg-gray-800 dark:text-gray-200' body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

           
            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
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
        