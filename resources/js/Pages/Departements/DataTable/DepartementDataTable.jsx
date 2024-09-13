import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Link, useForm } from "@inertiajs/react";

export default function DepartementDataTable({ products, setProducts, productDialog, setProductDialog, product, setProduct }) {
    
    
    
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const { delete: destroy, processing, reset } = useForm();
    const { setData, post } = useForm({ ids: [] });

    useEffect(() => {
        if (selectedProducts) {
            const idsToDelete = selectedProducts
                .filter((product) => product.id !== 1) // Filter products
                .map((product) => product.id);
            setData({ ids: idsToDelete });
            console.log("Products to delete:", idsToDelete);
        }
    }, [selectedProducts]);

    

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const editProduct = (product) => {
        if (product.id !== 1) {
            setProduct({ ...product });
            setProductDialog(true);
            console.log(product);
        }else{
            toast.current.show({
                severity: "error",
                summary: "Erreur",
                detail: "Interdit de modifier cet enregistrement",
                life: 3000,
            });
        }
    };

    const closeModal = () => {
        setDeleteProductDialog(false);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = (e) => {
        e.preventDefault();
        console.log(product);

        // Use the `product.id` (which is set when you confirm delete)
        if (product && product.id) {
            if (product.id !== 1) {
                destroy(route("departements.destroy", product.id), {
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
                            detail: "Département Supprimé",
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
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Erreur",
                    detail: "Interdit de supprimer cet enregistrement",
                    life: 3000,
                });
                closeModal();
            }
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        const idsToDelete = selectedProducts
            .filter((product) => product.id !== 1) // Filter products
            .map((product) => product.id);
        console.log("IDS", idsToDelete);

        post(route("departements.deleteMultiple"), {
            method: "post", // Ensure the method is specified as POST
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

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={()=>setProductDialog(true)}
                >
                    Ajouter département
                </Button>
                <Button
                    label="Supprimer"
                    icon="ti ti-trash"
                    severity="danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedProducts || !selectedProducts.length}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between ">
                <Button
                    label="Exporter"
                    icon="ti ti-upload"
                    className="p-button-help"
                    onClick={exportCSV}
                />
                {header}
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="ti ti-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => editProduct(rowData)}
                />
                <Button
                    icon="ti ti-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteProduct(rowData)}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between ">
            <InputText
                type="search"
                className='"p-inputtext-sm'
                onInput={(e) => setGlobalFilter(e.target.value)}
                placeholder="Rechercher..."
            />
        </div>
    );

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button
                label="Non"
                className="mr-1"
                icon="ti ti-circle-x"
                outlined
                onClick={hideDeleteProductDialog}
            />
            <Button
                label="Oui"
                icon="ti ti-trash"
                severity="danger"
                onClick={deleteProduct}
            />
        </React.Fragment>
    );

    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button
                label="Non"
                className="mr-1"
                icon="ti ti-circle-x"
                outlined
                onClick={hideDeleteProductsDialog}
            />
            <Button
                label="Oui"
                icon="ti ti-trash"
                severity="danger"
                onClick={deleteSelectedProducts}
            />
        </React.Fragment>
    );

    const fonctionsTemplate = (rowData) => {
        return (
            <ul>
                {rowData.fonctions.map((fonction) => (
                    <li className="text-xs list-item" key={fonction.id}>
                        {fonction.name}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card ">
                <Toolbar
                    className="mb-4 dark:bg-gray-800"
                    left={leftToolbarTemplate}
                    right={rightToolbarTemplate}
                ></Toolbar>

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
                    currentPageReportTemplate="Affichage de {first} à {last} des départements de {totalRecords}."
                    emptyMessage="Pas de données"
                    globalFilter={globalFilter}
                >
                    <Column
                        selectionMode="multiple"
                        exportable={false}
                    ></Column>
                    <Column
                        field="id"
                        header="Id"
                        sortable
                        style={{ minWidth: "12rem" }}
                    ></Column>
                    <Column
                        field="nom_departement"
                        header="Département"
                        sortable
                        style={{ minWidth: "16rem" }}
                    ></Column>
                    <Column
                        body={fonctionsTemplate}
                        header="Fonctions"
                        style={{ minWidth: "16rem" }}
                    ></Column>
                    <Column
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{ minWidth: "12rem" }}
                    ></Column>
                </DataTable>
            </div>

            <Dialog
                visible={deleteProductDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Supprimer département"
                modal
                footer={deleteProductDialogFooter}
                onHide={hideDeleteProductDialog}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem" }}
                    />
                    {product && (
                        <span>
                            Êtes-vous sûr de vouloir supprimer{" "}
                            <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog
                visible={deleteProductsDialog}
                style={{ width: "32rem" }}
                breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                header="Supprimer les départements"
                modal
                footer={deleteProductsDialogFooter}
                onHide={hideDeleteProductsDialog}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem" }}
                    />
                    {product && (
                        <span>
                            Êtes-vous sûr de vouloir supprimer les produits
                            sélectionnés ?
                        </span>
                    )}
                </div>
            </Dialog>

            
        </div>
    );
}
