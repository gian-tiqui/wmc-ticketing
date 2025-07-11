import { useQuery } from "@tanstack/react-query";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { getTickets } from "../@utils/services/ticketService";
import { Query, Ticket } from "../types/types";
import { Link } from "react-router-dom";

const KnowledgebaseTable = () => {
  const [query] = useState<Query>({ search: "", limit: 10000 });
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const {
    data: ticketsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [`knowledgebase-tickets`],
    queryFn: () => getTickets(query),
  });

  const tickets: Ticket[] = ticketsData?.data?.tickets || [];

  useEffect(() => {
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      title: { value: null, matchMode: FilterMatchMode.CONTAINS },
      resolution: { value: null, matchMode: FilterMatchMode.CONTAINS },
      "status.name": { value: null, matchMode: FilterMatchMode.CONTAINS },
      "category.name": { value: null, matchMode: FilterMatchMode.CONTAINS },
      "department.code": { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "—";

  // Modern gradient header
  const header = (
    <div className="relative overflow-hidden border border-gray-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-t-2xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 transform -translate-x-8 translate-y-8 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-xl"></div>

      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-transparent text-gray-800 sm:text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
              Knowledgebase
            </h2>
            <p className="text-sm font-medium text-gray-600">
              {tickets.length} tickets available
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch w-full gap-3 sm:flex-row sm:items-center sm:w-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md flex-1 sm:min-w-[280px]"
            />
          </div>
          <Button
            onClick={initFilters}
            className="px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 border-2 border-gray-200 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-md whitespace-nowrap"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );

  // Modern mobile card template
  const mobileCardTemplate = (rowData: Ticket) => (
    <div className="relative overflow-hidden transition-all duration-300 border border-gray-200 shadow-sm group bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-xl hover:border-blue-200">
      {/* Card gradient overlay */}
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 group-hover:opacity-100"></div>

      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold leading-tight text-gray-800 break-words transition-colors group-hover:text-blue-600">
              {rowData.title}
            </h3>
            {rowData.resolution && (
              <p className="mt-2 text-sm text-gray-600 break-words line-clamp-2">
                <span className="font-medium text-gray-700">Resolution:</span>{" "}
                {rowData.resolution}
              </p>
            )}
          </div>
          <Link
            to={`/ticket/${rowData.id}/knowledgebase`}
            className="flex items-center justify-center w-10 h-10 ml-4 text-white transition-all duration-200 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl hover:shadow-xl hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
            {rowData.status?.type || "—"}
          </span>
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
            {rowData.category?.name || "—"}
          </span>
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
            {rowData.department?.code || "—"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 text-sm border-t border-gray-100">
          <div>
            <span className="font-medium text-gray-700">Issuer</span>
            <div className="mt-1 text-sm text-gray-600">
              {`${rowData.issuer?.firstName || ""} ${
                rowData.issuer?.lastName || ""
              }`.trim() || "—"}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Assigned</span>
            <div className="mt-1 text-sm text-gray-600">
              {rowData.assignedUser
                ? `${rowData.assignedUser.firstName} ${rowData.assignedUser.lastName}`
                : "Unassigned"}
            </div>
          </div>
          <div className="col-span-2 pt-2">
            <span className="font-medium text-gray-700">Created</span>
            <div className="mt-1 text-sm text-gray-600">
              {rowData.createdAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="px-2 pt-4 pb-8 sm:px-4">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
            <span className="text-lg font-medium text-gray-600">
              Loading tickets...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="px-2 pt-4 pb-8 sm:px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-red-600">
              Error loading tickets
            </p>
            <p className="mt-1 text-sm text-gray-600">{error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 pt-4 pb-8 sm:px-4">
      <div className="mx-auto max-w-7xl">
        {header}

        {/* Mobile view - Modern card layout */}
        <div className="block lg:hidden">
          <div className="p-6 border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 border-x rounded-b-2xl">
            {tickets.length === 0 ? (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-600">
                  No tickets found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket, index) => (
                  <div key={ticket.id || index}>
                    {mobileCardTemplate(ticket)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop view - Modern table layout */}
        <div className="hidden lg:block">
          <div className="overflow-hidden border-b border-gray-200 shadow-sm bg-white/80 backdrop-blur-sm border-x rounded-b-2xl">
            <div className="overflow-x-auto">
              <DataTable
                value={tickets}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 25, 50]}
                scrollable
                scrollHeight="65vh"
                size="small"
                filters={filters}
                filterDisplay="row"
                globalFilterFields={[
                  "title",
                  "resolution",
                  "status.name",
                  "category.name",
                  "department.code",
                ]}
                emptyMessage={
                  <div className="py-12 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-600">
                      No tickets found
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search criteria
                    </p>
                  </div>
                }
                loading={isLoading}
                className="min-w-[1024px] text-sm"
                stripedRows
                pt={{
                  bodyRow: {
                    className:
                      "hover:bg-blue-50/50 transition-colors duration-200",
                  },
                  headerRow: {
                    className:
                      "bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200",
                  },
                  paginator: {
                    root: {
                      className:
                        "bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-200 px-4 py-3",
                    },
                  },
                  root: {
                    className: "shadow-sm",
                  },
                }}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
              >
                <Column
                  header="Title"
                  field="title"
                  filterPlaceholder="Search title..."
                  style={{ minWidth: "200px", maxWidth: "300px" }}
                  bodyStyle={{ wordBreak: "break-word", fontWeight: "500" }}
                  pt={{
                    filterInput: {
                      className:
                        "text-xs p-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                    },
                  }}
                />

                <Column
                  header="Category"
                  field="category.name"
                  filterPlaceholder="Search category..."
                  body={(rowData: Ticket) => (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                      {rowData.category?.name || "—"}
                    </span>
                  )}
                  style={{ minWidth: "150px" }}
                  pt={{
                    filterInput: {
                      className:
                        "text-xs p-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                    },
                  }}
                />

                <Column
                  header="Status"
                  field="status.type"
                  filterPlaceholder="Search status..."
                  body={(rowData: Ticket) => (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                      {rowData.status?.type || "—"}
                    </span>
                  )}
                  style={{ minWidth: "120px" }}
                  pt={{
                    filterInput: {
                      className:
                        "text-xs p-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                    },
                  }}
                />

                <Column
                  header="Issuer"
                  body={(rowData: Ticket) => (
                    <div className="font-medium text-gray-700">
                      {`${rowData.issuer?.firstName || ""} ${
                        rowData.issuer?.lastName || ""
                      }`.trim() || "—"}
                    </div>
                  )}
                  style={{ minWidth: "150px" }}
                />

                <Column
                  header="Assigned"
                  body={(rowData: Ticket) => (
                    <div className="font-medium text-gray-700">
                      {rowData.assignedUser ? (
                        `${rowData.assignedUser.firstName} ${rowData.assignedUser.lastName}`
                      ) : (
                        <span className="italic text-gray-400">Unassigned</span>
                      )}
                    </div>
                  )}
                  style={{ minWidth: "150px" }}
                />

                <Column
                  header="Created"
                  body={(rowData: Ticket) => (
                    <div className="text-sm text-gray-600">
                      {formatDate(rowData.createdAt)}
                    </div>
                  )}
                  style={{ minWidth: "120px" }}
                />

                <Column
                  header="Action"
                  body={(rowData: Ticket) => (
                    <Link
                      to={`/ticket/${rowData.id}/knowledgebase`}
                      className="inline-flex items-center justify-center w-8 h-8 text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600 hover:shadow-lg hover:scale-105"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </Link>
                  )}
                  style={{ minWidth: "80px" }}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgebaseTable;
