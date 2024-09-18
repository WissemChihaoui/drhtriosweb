import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";
import { Link } from "@inertiajs/react";
import { Tag } from "primereact/tag";
import CollapsedDataTable from "./CollapsedDataTable";

const PresencesDataTable = ({ presences, conges }) => {
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);
    const expandAll = () => {
        let _expandedRows = {};

        presences.forEach((p) => (_expandedRows[`${p.id}`] = true));

        setExpandedRows(_expandedRows);
    };
    const collapseAll = () => {
        setExpandedRows(null);
    };
    const header = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button icon="ti ti-plus" size="small" label="Développer tout" onClick={expandAll} text />
            <Button icon="ti ti-minus" size="small" label="Réduire tout" onClick={collapseAll} text />
        </div>
    );
    const employeeNameTemplate = (rowData) => {
        return rowData.employee.name;
    };

    const monthTemplate = (rowData) => {
        const [day, month, year] = rowData.month.split("-");

        const date = new Date(`${year}-${month}-${day}`);

        const options = { month: "long", year: "numeric" };
        return date.toLocaleDateString("fr-FR", options);
    };
    const activityBodyTemplate = (rowData) => {
        const data = JSON.parse(rowData.presence_data);
        const totalDays = Object.keys(data).length;
        const presentDays = Object.values(data).filter(
            (entry) => entry.status === "1"
        ).length;
        const percentage = (presentDays / totalDays) * 100;

        return <ProgressBar value={percentage.toFixed(2)}></ProgressBar>;
    };

    const mainActionTemplate = (rowData) => {
        return (
            <div className="flex gap-1">
                <Button type="button" icon="ti ti-calendar" rounded></Button>
                <Link
                    href={route("edit.worker.page", {
                        id: rowData.employee_id,
                    })}
                >
                    <Button type="button" icon="ti ti-user" rounded></Button>
                </Link>
            </div>
        );
    };

    const allowExpansion = (rowData) => {
        return rowData.presence_data.length > 0;
    };

    const todayPresenceTemplate = (rowData) => {
        const presenceData = JSON.parse(rowData.presence_data);
        const today = new Date();
        const formattedToday = today
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-");

        if (presenceData[formattedToday]) {
            const todayData = presenceData[formattedToday];

            return (
                <Tag severity={todayData.status == 1 ? "success" : "danger"}>
                    {todayData.status == 1 ? "Présent" : "Absent"}
                </Tag>
            );
        } else {
            return "";
        }
    };
    const collapsedTemplate = (rowData) => {
        return <CollapsedDataTable rowData={rowData} conges={conges}/>
    }
    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                value={presences}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={collapsedTemplate}
                dataKey="id"
                header={header}
                tableStyle={{ minWidth: "60rem" }}
            >
                <Column expander={allowExpansion} style={{ width: "5rem" }} />
                <Column
                    body={employeeNameTemplate}
                    header="Nom d'employée"
                    sortable
                />
                <Column body={monthTemplate} header="Mois" sortable />
                <Column
                    body={todayPresenceTemplate}
                    header="Statut de jour"
                    sortable
                />
                <Column
                    body={activityBodyTemplate}
                    header="Présence en ce mois"
                />
                <Column body={mainActionTemplate} header="Action" />
            </DataTable>
        </div>
    );
};

export default PresencesDataTable;
