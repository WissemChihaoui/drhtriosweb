import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import {  useForm } from "@inertiajs/react";
export default function QuestionnaireDataTable({products,setProducts,product,toast, setProductDialog,setProduct }) {
    
    const { setData, post } = useForm({ ids: [] });
    const { delete: destroy, processing, reset } = useForm();

    
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const exportCSV = () => {
        dt.current.exportCSV();
    };    
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const closeModal = () => {
        setDeleteProductDialog(false);
    };

    const deleteProduct = (e) => {
        e.preventDefault();
        if (product && product.id) {
            destroy(route("questionnaire.destroy", product.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setProducts(
                        products.filter(
                            (productOld) => productOld.id !== product.id
                        )
                    );
                    closeModal();
                    toast.current.show({
                        severity: "success",
                        summary: "Supprimé",
                        detail: "Questionnaire a été Supprimé",
                        life: 3000,
                    });
                }, // Close modal if successful
                onError: () => {
                    toast.current.show({
                        severity: "error",
                        summary: "Erreur",
                        detail: "Erreur lors du suppression ",
                        life: 3000,
                    });
                },
                onFinish: () => reset(), // Reset form state on finish
            });
    }
    };
    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };
    useEffect(() => {
        if (selectedProducts) {
            const idsToDelete = selectedProducts
                .map((product) => product.id);
            setData({ ids: idsToDelete });
            console.log("Products to delete:", idsToDelete);
        }
    }, [selectedProducts]);
    const deleteSelectedProducts = () => {
        const idsToDelete = selectedProducts.map((product) => product.id);
        console.log("IDS", idsToDelete);

        post(route("questionnaire.destroyMultiple"), {
            method: "post", 
            onSuccess: () => {
                setDeleteProductsDialog(false);
                setSelectedProducts(null);
                setProducts(
                    products.filter(
                        (product) => !idsToDelete.includes(product.id)
                    )
                );
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Employees Deleted",
                    life: 3000,
                });
            },
            onError: () => {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to delete employees",
                    life: 3000,
                });
            },
            onFinish: () => reset(),
        });
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
        console.log(product);
};

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Ajouter" icon="ti ti-plus" severity="success" onClick={()=>setProductDialog(true)} />
                <Button label="Supprimer" icon="ti ti-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Exporter" icon="ti ti-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="ti ti-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="ti ti-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 items-center justify-between">
            <h4 className="m-0">Les Questionnaires</h4>
            <IconField iconPosition="left">
                <InputIcon className="ti ti-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." />
            </IconField>
        </div>
    );
    
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" className='mr-2' icon="ti ti-x" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="ti ti-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" className='mr-2' icon="ti ti-x" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="ti ti-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="ID" sortable style={{ minWidth: '4rem' }}></Column>
                    <Column field="id_emp" header="ID Employée" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="employee.name" header="Nom" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="sanctions.type_sanction" header="Sanction" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="description" header="Description" style={{ minWidth: '16rem' }}></Column>
                    <Column field="date" header="Date" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="ti ti-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Êtes-vous sûr de vouloir supprimer le questionnaire <b>#{product.id}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="ti ti-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Êtes-vous sûr de vouloir supprimer les questionnaires sélectionnés ?</span>}
                </div>
            </Dialog>
        </div>
    );
}
        