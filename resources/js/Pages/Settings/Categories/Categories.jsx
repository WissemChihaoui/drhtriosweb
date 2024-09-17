import React, { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Toast } from "primereact/toast";
import CategoriesDataTable from "./DataTable/CategoriesDataTable";
import AddCategory from "./Modals/AddCategory";

const Categories = ({ auth, categories }) => {
    const emptyCategorie = {
        id: null,
        name: "",
    };
    console.log(categories);
    const [categoriesData, setCategoriesData] = useState(null);
    const [category, setCategory] = useState(emptyCategorie);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setCategory(emptyCategorie);
    };

    useEffect(() => {
        setCategoriesData(categories);
        setCategory(emptyCategorie);
    }, [submitted]);

    return (
        <AuthenticatedLayout auth={auth} header={"Liste des catégories"}>
            <Toast ref={toast} />
            <CategoriesDataTable
                products={categoriesData}
                setProducts={setCategoriesData}
                productDialog={productDialog}
                setProductDialog={setProductDialog}
                product={category}
                setProduct={setCategory}
            />
            {productDialog && (
                <AddCategory
                    productDialog={productDialog}
                    hideDialog={hideDialog}
                    toast={toast}
                    submitted={submitted}
                    product={category}
                    setSubmitted={setSubmitted}
                />
            )}
        </AuthenticatedLayout>
    );
};

export default Categories;
