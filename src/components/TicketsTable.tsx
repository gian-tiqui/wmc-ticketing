import React, { useEffect, useState } from "react";
import { Ticket } from "../types/types";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
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
    <div className="flex flex-col gap-4 px-4 py-4 border-b border-gray-200 lg:flex-row lg:justify-between lg:items-center bg-gradient-to-r from-slate-50 to-gray-50 sm:px-6 rounded-t-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600">
          <i className="text-lg text-white pi pi-ticket" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
            Support Tickets
          </h2>
          <p className="text-sm text-gray-500">
            {tickets?.length || 0} ticket{tickets?.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
      </div>
      <div className="flex flex-col items-stretch w-full gap-3 sm:flex-row sm:items-center lg:w-auto">
        <div className="relative flex-1 lg:flex-none">
          <i className="absolute text-sm text-gray-400 transform -translate-y-1/2 left-3 top-1/2 pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search tickets..."
            className="w-full py-2 pl-10 pr-4 text-sm transition-all duration-200 border border-gray-300 rounded-lg shadow-sm lg:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button
          onClick={clearFilter}
          className="px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
        >
          <i className="mr-2 pi pi-times" />
          Clear
        </Button>
      </div>
    </div>
  );

  const ticketNumberTemplate = (rowData: Ticket) => (
    <div className="inline-block px-3 py-1 font-mono text-sm font-semibold text-indigo-600 rounded-full bg-indigo-50">
      #{rowData.id}
    </div>
  );

  const titleTemplate = (rowData: Ticket) => (
    <div className="max-w-xs">
      <div className="font-semibold text-gray-800 truncate">
        {rowData.title}
      </div>
    </div>
  );

  const categoryTemplate = (rowData: Ticket) => (
    <div className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
      <i className="mr-1 pi pi-tag" />
      {rowData.category?.name || "Uncategorized"}
    </div>
  );

  const overdueTemplate = (rowData: Ticket) => (
    <div className="flex items-center">
      {rowData.isOverdue ? (
        <div className="inline-flex items-center px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
          <i className="mr-1 pi pi-exclamation-triangle" />
          Overdue
        </div>
      ) : (
        <div className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
          <i className="mr-1 pi pi-check-circle" />
          On Time
        </div>
      )}
    </div>
  );

  const assigneeTemplate = (rowData: Ticket) => (
    <div className="flex items-center">
      {rowData.assignedUser ? (
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-full bg-gradient-to-r from-purple-400 to-pink-400">
            {rowData.assignedUser.firstName.charAt(0)}
            {rowData.assignedUser.lastName.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-gray-800">
              {rowData.assignedUser.firstName} {rowData.assignedUser.lastName}
            </div>
          </div>
        </div>
      ) : (
        <div className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
          <i className="mr-1 pi pi-user-minus" />
          <span className="hidden sm:inline">Unassigned</span>
          <span className="sm:hidden">N/A</span>
        </div>
      )}
    </div>
  );

  const actionTemplate = (rowData: Ticket) => (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <Button
        icon="pi pi-eye"
        className="w-8 h-8 transition-all duration-200 transform border-none rounded-lg shadow-md sm:w-9 sm:h-9 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:scale-105"
        onClick={() => navigate(`/ticket/${rowData.id}`)}
        tooltip="View Ticket"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  return (
    <div className="mx-2 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl sm:mx-4 lg:mx-0">
      {header}

      {/* Wrapper with proper scrolling */}
      <div className="w-full overflow-x-auto border border-gray-200 shadow-sm rounded-xl">
        <DataTable
          value={tickets}
          paginator
          rows={8}
          size="normal"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "title",
            "category.name",
            "assignedUser.firstName",
            "createdAt",
          ]}
          emptyMessage={
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <i className="mb-3 text-3xl text-gray-400 sm:mb-4 sm:text-4xl pi pi-inbox" />
              <h3 className="mb-2 text-base font-semibold text-gray-600 sm:text-lg">
                No tickets found
              </h3>
              <p className="px-4 text-xs text-center text-gray-500 sm:text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          }
          className="text-xs sm:text-sm"
          stripedRows
          pt={{
            bodyRow: {
              className:
                "hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100",
            },
            headerRow: {
              className:
                "bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200",
            },
            thead: {
              className:
                "text-gray-700 font-semibold py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-6 text-xs sm:text-sm",
            },
            tbody: {
              className: "py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-6",
            },
            paginator: {
              root: {
                className:
                  "bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200 px-2 sm:px-3 md:px-6 py-3 sm:py-4",
              },
            },
            root: {
              className: "text-xs sm:text-sm border-0 rounded-xl",
            },
            wrapper: {
              className: "rounded-xl",
            },
            table: {
              className: "min-w-full table-fixed",
            },
          }}
        >
          {/* Ticket Number - Fixed width */}
          <Column
            header="Ticket #"
            field="id"
            body={ticketNumberTemplate}
            pt={{
              filterInput: {
                className:
                  "text-xs p-1.5 sm:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ width: "80px", minWidth: "80px" }}
            headerStyle={{ width: "80px", minWidth: "80px" }}
          />

          {/* Title - Flexible with text truncation */}
          <Column
            header="Title"
            field="title"
            body={(rowData) => (
              <div className="flex-1 max-w-0">
                <div
                  className="pr-2 truncate transition-colors cursor-pointer hover:text-blue-600"
                  title={rowData.title}
                  onClick={() => titleTemplate(rowData)}
                >
                  {rowData.title}
                </div>
              </div>
            )}
            filterPlaceholder="Search..."
            pt={{
              filterInput: {
                className:
                  "text-xs p-1.5 sm:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ width: "200px", minWidth: "150px" }}
            headerStyle={{ width: "200px", minWidth: "150px" }}
          />

          {/* Category - Fixed width, hidden on mobile */}
          <Column
            header="Category"
            field="category.name"
            body={(rowData) => (
              <div className="truncate" title={rowData.category?.name}>
                {categoryTemplate(rowData)}
              </div>
            )}
            filterPlaceholder="Category..."
            pt={{
              filterInput: {
                className:
                  "text-xs p-1.5 sm:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ width: "120px", minWidth: "120px" }}
            headerStyle={{ width: "120px", minWidth: "120px" }}
            className="hidden sm:table-cell"
          />

          {/* Status - Fixed width */}
          <Column
            header="Status"
            field="isOverdue"
            body={overdueTemplate}
            filterPlaceholder="Status..."
            pt={{
              filterInput: {
                className:
                  "text-xs p-1.5 sm:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ width: "100px", minWidth: "100px" }}
            headerStyle={{ width: "100px", minWidth: "100px" }}
          />

          {/* Assigned - Fixed width, hidden on mobile */}
          <Column
            header="Assigned"
            field="assignedUser.firstName"
            body={(rowData) => (
              <div className="truncate" title={rowData.assignedUser?.firstName}>
                {assigneeTemplate(rowData)}
              </div>
            )}
            filterPlaceholder="Assignee..."
            pt={{
              filterInput: {
                className:
                  "text-xs p-1.5 sm:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ width: "120px", minWidth: "120px" }}
            headerStyle={{ width: "120px", minWidth: "120px" }}
            className="hidden md:table-cell"
          />

          {/* Actions - Fixed width */}
          <Column
            header="Actions"
            body={actionTemplate}
            style={{ width: "80px", minWidth: "80px" }}
            headerStyle={{ width: "80px", minWidth: "80px" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default TicketsTable;
