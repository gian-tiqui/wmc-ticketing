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
    <div className="flex flex-col gap-3 px-3 py-3 border-b border-gray-200 rounded-t-lg sm:gap-4 sm:px-4 lg:px-6 sm:py-4 lg:flex-row lg:justify-between lg:items-center bg-gradient-to-r from-slate-50 to-gray-50 sm:rounded-t-xl">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg shadow-lg sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600">
          <i className="text-sm text-white sm:text-lg pi pi-ticket" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800 sm:text-lg lg:text-xl">
            Support Tickets
          </h2>
          <p className="text-xs text-gray-500 sm:text-sm">
            {tickets?.length || 0} ticket{tickets?.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
      </div>
      <div className="flex flex-col items-stretch w-full gap-2 sm:gap-3 sm:flex-row sm:items-center lg:w-auto">
        <div className="relative flex-1 lg:flex-none">
          <i className="absolute text-xs text-gray-400 transform -translate-y-1/2 sm:text-sm left-2 sm:left-3 top-1/2 pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search tickets..."
            className="w-full py-1.5 sm:py-2 pl-8 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm transition-all duration-200 border border-gray-300 rounded-lg shadow-sm lg:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button
          onClick={clearFilter}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
        >
          <i className="mr-1 sm:mr-2 pi pi-times" />
          Clear
        </Button>
      </div>
    </div>
  );

  const ticketNumberTemplate = (rowData: Ticket) => (
    <div className="inline-block px-2 py-1 font-mono text-xs font-semibold text-indigo-600 rounded-full sm:px-3 sm:text-sm bg-indigo-50">
      #{rowData.id}
    </div>
  );

  const categoryTemplate = (rowData: Ticket) => (
    <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full sm:px-3">
      <i className="mr-1 pi pi-tag" />
      <span className="hidden sm:inline">
        {rowData.category?.name || "Uncategorized"}
      </span>
      <span className="sm:hidden">
        {(rowData.category?.name || "Uncategorized").substring(0, 6)}...
      </span>
    </div>
  );

  const overdueTemplate = (rowData: Ticket) => (
    <div className="flex items-center">
      {rowData.isOverdue ? (
        <div className="inline-flex items-center px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full sm:px-3">
          <i className="mr-1 pi pi-exclamation-triangle" />
          <span className="hidden sm:inline">Overdue</span>
          <span className="sm:hidden">!</span>
        </div>
      ) : (
        <div className="inline-flex items-center px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full sm:px-3">
          <i className="mr-1 pi pi-check-circle" />
          <span className="hidden sm:inline">On Time</span>
          <span className="sm:hidden">✓</span>
        </div>
      )}
    </div>
  );

  const assigneeTemplate = (rowData: Ticket) => (
    <div className="flex items-center">
      {rowData.assignedUser ? (
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-pink-400">
            {rowData.assignedUser.firstName.charAt(0)}
            {rowData.assignedUser.lastName.charAt(0)}
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-medium text-gray-800 sm:text-sm">
              {rowData.assignedUser.firstName} {rowData.assignedUser.lastName}
            </div>
          </div>
        </div>
      ) : (
        <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full sm:px-3">
          <i className="mr-1 pi pi-user-minus" />
          <span className="hidden sm:inline">Unassigned</span>
          <span className="sm:hidden">N/A</span>
        </div>
      )}
    </div>
  );

  const actionTemplate = (rowData: Ticket) => (
    <div className="flex items-center justify-center">
      <Button
        icon="pi pi-eye"
        className="transition-all duration-200 transform border-none rounded-lg shadow-md w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:scale-105"
        onClick={() => navigate(`/ticket/${rowData.id}`)}
        tooltip="View Ticket"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  return (
    <div className="mx-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg sm:mx-2 lg:mx-4 xl:mx-0 sm:rounded-xl">
      {header}

      {/* Wrapper with proper scrolling */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
        <DataTable
          value={tickets}
          paginator
          rows={8}
          size="small"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            "title",
            "category.name",
            "assignedUser.firstName",
            "createdAt",
          ]}
          emptyMessage={
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 lg:py-12">
              <i className="mb-2 text-2xl text-gray-400 sm:mb-3 lg:mb-4 sm:text-3xl lg:text-4xl pi pi-inbox" />
              <h3 className="mb-1 text-sm font-semibold text-gray-600 sm:mb-2 sm:text-base lg:text-lg">
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
                "text-gray-700 font-semibold py-1 sm:py-2 lg:py-3 px-1 sm:px-2 lg:px-3 text-xs sm:text-sm",
            },
            tbody: {
              className: "py-1 sm:py-2 lg:py-3 px-1 sm:px-2 lg:px-3",
            },
            paginator: {
              root: {
                className:
                  "bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200 px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4",
              },
            },
            root: {
              className: "text-xs sm:text-sm border-0 rounded-lg sm:rounded-xl",
            },
            wrapper: {
              className: "rounded-lg sm:rounded-xl",
            },
            table: {
              className: "min-w-full table-auto",
            },
          }}
        >
          {/* Ticket Number - Always visible */}
          <Column
            header="#"
            field="id"
            body={ticketNumberTemplate}
            pt={{
              headerCell: {
                className: "!table-cell",
              },
              bodyCell: {
                className: "!table-cell",
              },
              filterInput: {
                className:
                  "text-xs p-1 sm:p-1.5 lg:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ width: "80px", minWidth: "80px" }}
            headerStyle={{ width: "80px", minWidth: "80px" }}
          />

          {/* Title - Always visible, flexible */}
          <Column
            header="Title"
            field="title"
            body={(rowData) => (
              <div
                className="pr-1 sm:pr-2 truncate cursor-pointer hover:text-blue-600 max-w-[120px] sm:max-w-[200px] lg:max-w-none"
                title={rowData.title}
              >
                {rowData.title}
              </div>
            )}
            filterPlaceholder="Search..."
            pt={{
              headerCell: {
                className: "!table-cell",
              },
              bodyCell: {
                className: "!table-cell",
              },
              filterInput: {
                className:
                  "text-xs p-1 sm:p-1.5 lg:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ minWidth: "140px" }}
            headerStyle={{ minWidth: "140px" }}
          />

          {/* Category - Hidden on mobile, visible on sm+ */}
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
              headerCell: {
                className: "!hidden sm:!table-cell",
              },
              bodyCell: {
                className: "!hidden sm:!table-cell",
              },
              filterInput: {
                className:
                  "text-xs p-1 sm:p-1.5 lg:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ width: "120px", minWidth: "120px" }}
            headerStyle={{ width: "120px", minWidth: "120px" }}
          />

          {/* Status - Always visible */}
          <Column
            header="Status"
            field="isOverdue"
            body={overdueTemplate}
            filterPlaceholder="Status..."
            pt={{
              headerCell: {
                className: "!table-cell",
              },
              bodyCell: {
                className: "!table-cell",
              },
              filterInput: {
                className:
                  "text-xs p-1 sm:p-1.5 lg:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ width: "100px", minWidth: "100px" }}
            headerStyle={{ width: "100px", minWidth: "100px" }}
          />

          {/* Assigned - Hidden on mobile and tablet, visible on lg+ */}
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
              headerCell: {
                className: "!hidden lg:!table-cell",
              },
              bodyCell: {
                className: "!hidden lg:!table-cell",
              },
              filterInput: {
                className:
                  "text-xs p-1 sm:p-1.5 lg:p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full",
              },
            }}
            style={{ width: "140px", minWidth: "140px" }}
            headerStyle={{ width: "140px", minWidth: "140px" }}
          />

          {/* Actions - Always visible */}
          <Column
            header="Actions"
            body={actionTemplate}
            pt={{
              headerCell: {
                className: "!table-cell",
              },
              bodyCell: {
                className: "!table-cell",
              },
            }}
            style={{ width: "80px", minWidth: "80px" }}
            headerStyle={{ width: "80px", minWidth: "80px" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default TicketsTable;
