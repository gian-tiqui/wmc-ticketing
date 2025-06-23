import React, { useEffect, useState } from "react";
import { Ticket } from "../types/types";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { PrimeIcons, FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";

interface Props {
  tickets: Ticket[];
}

const TicketsTable: React.FC<Props> = ({ tickets }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      title: { value: null, matchMode: FilterMatchMode.CONTAINS },
      "category.name": { value: null, matchMode: FilterMatchMode.CONTAINS },
      "assignedUser.firstName": {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
      isOverdue: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    }));
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    initFilters();
  };

  const header = (
    <div className="flex justify-between items-center bg-[#eee] h-14 rounded-t px-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-blue-600">Tickets</span>
        <span className="text-sm text-gray-500">
          ({tickets?.length || 0} tickets)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search tickets..."
          className="h-8 px-4 text-sm"
        />
        <Button
          onClick={clearFilter}
          className="h-8 px-3 text-xs border rounded p-button-outlined p-button-sm hover:bg-gray-50"
        >
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <div className="pb-8">
      {header}

      <DataTable
        value={tickets}
        paginator
        rows={5}
        size="small"
        filters={filters}
        filterDisplay="row"
        globalFilterFields={[
          "title",
          "category.name",
          "assignedUser.firstName",
          "createdAt",
        ]}
        emptyMessage="No tickets found."
        className="text-sm"
        pt={{
          bodyRow: { className: "bg-[#EEEEEE]" },
          headerRow: { className: "bg-[#EEEEEE]" },
          paginator: { root: { className: "bg-[#EEEEEE] rounded-b" } },
          root: { className: "text-xs" },
        }}
      >
        <Column
          header="Ticket Number"
          field="id"
          pt={{ filterInput: { className: "text-xs" } }}
          style={{ minWidth: "6rem" }}
        />
        <Column
          header="Title"
          field="title"
          filter
          pt={{}}
          filterPlaceholder="Search by title"
          style={{ minWidth: "12rem" }}
        />
        <Column
          header="Category"
          field="category.name"
          filter
          filterPlaceholder="Search by category"
          body={(rowData: Ticket) => rowData.category?.name || "N/A"}
          style={{ minWidth: "10rem" }}
        />

        <Column
          header="Overdue"
          field="isOverdue"
          filter
          filterPlaceholder="true / false"
          body={(rowData: Ticket) =>
            rowData.isOverdue ? (
              <span className="font-semibold text-red-500">Yes</span>
            ) : (
              <span className="text-green-600">No</span>
            )
          }
          style={{ minWidth: "8rem" }}
        />
        <Column
          header="Assigned To"
          field="assignedUser.firstName"
          filter
          filterPlaceholder="Search by assignee"
          body={(rowData: Ticket) =>
            rowData.assignedUser ? (
              <>
                {rowData.assignedUser.firstName} {rowData.assignedUser.lastName}
              </>
            ) : (
              "None"
            )
          }
          style={{ minWidth: "12rem" }}
        />
        <Column
          header="Action"
          body={(rowData: Ticket) => (
            <Button
              icon={PrimeIcons.DIRECTIONS}
              className="w-10 h-10 bg-blue-600 rounded-full"
              onClick={() => navigate(`/ticket/${rowData.id}`)}
            />
          )}
          style={{ minWidth: "8rem" }}
        />
      </DataTable>
    </div>
  );
};

export default TicketsTable;
