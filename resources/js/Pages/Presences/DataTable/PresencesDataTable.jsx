import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ProgressBar } from "primereact/progressbar";
import { Link } from "@inertiajs/react";
import { Tag } from "primereact/tag";
import CollapsedDataTable from "./CollapsedDataTable";
import { Calendar } from "primereact/calendar";

const PresencesDataTable = ({ presences, conges }) => {
    console.log(presences)
    const getDefaultMonth = () => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    };

    const [date, setDate] = useState(getDefaultMonth()); // Default to current month
    const [expandedRows, setExpandedRows] = useState(null);
    const [filteredPresences, setFilteredPresences] = useState(presences);
    const toast = useRef(null);

    // Function to filter presences based on selected date
    useEffect(() => {
        const selectedMonth = date.getMonth() + 1; // JavaScript months are 0-based
        const selectedYear = date.getFullYear();

        // Format month and year as 2-digit strings
        const formattedMonth = selectedMonth.toString().padStart(2, "0");
        const formattedYear = selectedYear.toString();

        const filtered = presences.filter((presence) => {
            const [day, month, year] = presence.month.split("-");
            return month === formattedMonth && year === formattedYear;
        });

        setFilteredPresences(filtered);
    }, [date, presences]);

    const expandAll = () => {
        let _expandedRows = {};
        filteredPresences.forEach((p) => (_expandedRows[`${p.id}`] = true));
        setExpandedRows(_expandedRows);
    };

    const collapseAll = () => {
        setExpandedRows(null);
    };

    const header = (
        <div className="flex w-full justify-between items-center">
            <div className="flex flex-wrap justify-content-end gap-2">
                <Button icon="ti ti-plus" size="small" label="Développer tout" onClick={expandAll} text />
                <Button icon="ti ti-minus" size="small" label="Réduire tout" onClick={collapseAll} text />
            </div>
            <Calendar value={date} onChange={(e) => setDate(e.value)} view="month" dateFormat="mm/yy" />
        </div>
    );

    const employeeNameTemplate = (rowData) => rowData.employee.name;

    const monthTemplate = (rowData) => {
        const [day, month, year] = rowData.month.split("-");
        const date = new Date(`${year}-${month}-${day}`);
        const options = { month: "long", year: "numeric" };
        return date.toLocaleDateString("fr-FR", options);
    };

    const activityBodyTemplate = (rowData) => {
        const data = JSON.parse(rowData.presence_data);
        const totalDays = Object.keys(data).length;
        const presentDays = Object.values(data).filter((entry) => entry.status == "1").length;
        const percentage = (presentDays / totalDays) * 100;
        return <ProgressBar value={percentage.toFixed(2)}></ProgressBar>;
    };

    const mainActionTemplate = (rowData) => {
        const date = rowData.month;
        return (
            <div className="flex gap-1">
                <Link href={route("calendar.index", { id: rowData.employee_id, date: date })}>
                    <Button type="button" icon="ti ti-calendar" rounded></Button>
                </Link>
                <Link href={route("edit.worker.page", { id: rowData.employee_id })}>
                    <Button type="button" icon="ti ti-user" rounded></Button>
                </Link>
            </div>
        );
    };

    const allowExpansion = (rowData) => rowData.presence_data.length > 0;

    const todayPresenceTemplate = (rowData) => {
        const presenceData = JSON.parse(rowData.presence_data);
        const today = new Date();
        const formattedToday = today.toLocaleDateString("en-GB").replace(/\//g, "-");

        if (presenceData[formattedToday]) {
            const todayData = presenceData[formattedToday];
            return <Tag severity={todayData.status == 1 ? "success" : "danger"}>{todayData.status == 1 ? "Présent" : "Absent"}</Tag>;
        } else {
            return "";
        }
    };

    const collapsedTemplate = (rowData) => <CollapsedDataTable rowData={rowData} conges={conges} />;

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                value={filteredPresences} // Use filtered presences
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={collapsedTemplate}
                dataKey="id"
                header={header}
                tableStyle={{ minWidth: "60rem" }}
            >
                <Column expander={allowExpansion} style={{ width: "5rem" }} />
                <Column body={employeeNameTemplate} header="Nom d'employée" sortable />
                <Column body={monthTemplate} header="Mois" sortable />
                <Column body={todayPresenceTemplate} header="Statut de jour" sortable />
                <Column body={activityBodyTemplate} header="Présence en ce mois" />
                <Column body={mainActionTemplate} header="Action" />
            </DataTable>
        </div>
    );
};

export default PresencesDataTable;
