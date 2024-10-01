import { useForm } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

const CsvFile = () => {
    const toastRef = useRef(null);
    const { data, setData, post, reset } = useForm(null);
    const [arrayOfObjects, setArrayOfObjects] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setData(arrayOfObjects);
    }, [arrayOfObjects]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setCsvFile(file);

        if (file) {
            const reader = new FileReader();
            reader.readAsText(file);

            reader.onloadend = () => {
                const csvText = reader.result;
                setArrayOfObjects(csvToArray(csvText));
            };

            reader.onerror = () => {
                console.error("File reading error");
                toastRef.current.show({
                    severity: "error",
                    summary: "File Error",
                    detail: "Failed to read CSV file",
                    life: 3000,
                });
            };
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const submitFile = () => {
        if (arrayOfObjects) {
            post(route("push.csv.worker"), {
                method: "post",
                onSuccess: (response) => {
                    console.log(response);
                    setArrayOfObjects(null); 
                    setCsvFile(null); 
                    document.getElementById("fileInput").value = "";
                    toastRef.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Employees Ajouté",
                        life: 3000,
                    });
                },
                onError: () => {
                    toastRef.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to process employees",
                        life: 3000,
                    });
                },
                onFinish: () => reset(),
            });
        }
    };

    const csvToArray = (csv) => {
        const lines = csv.split("\n");
        const headers = lines[0].split(";");
        const result = lines
            .slice(1)
            .filter((line) => line.length > 10) 
            .map((line) => {
                const values = line.split(";");
                const obj = headers.reduce((acc, header, index) => {
                    acc[header.trim()] = values[index]?.trim() || "";
                    return acc;
                }, {});
                return obj;
            });
        return result;
    };

    return (
        <>
            <Toast ref={toastRef} />
            <input
                type="file"
                id="fileInput"
                accept=".csv"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <Button
                label={csvFile ? "Enregistrer CSV" : "Choisir CSV"}
                icon={csvFile ? "ti ti-check" : "ti ti-upload"}
                onClick={csvFile ? submitFile : triggerFileInput}
                className="p-mt-3"
            />
        </>
    );
};

export default CsvFile;
