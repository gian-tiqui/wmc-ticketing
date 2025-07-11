import { useQuery } from "@tanstack/react-query";
import PageTemplate from "../templates/PageTemplate";
import { generateReport } from "../@utils/services/reportService";
import { useRef, useState } from "react";
import { Query, Ticket } from "../types/types";
import { getDepartments } from "../@utils/services/departmentService";
import { getAllStatus } from "../@utils/services/statusService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const ReportsPage = () => {
  const [query, setQuery] = useState<Query>({});
  const [generate, setGenerate] = useState(false);

  const dt = useRef<DataTable<Ticket[]>>(null);

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getDepartments({ limit: 100, offset: 0 }),
  });

  const { data: statuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: () => getAllStatus({ limit: 10 }),
  });

  const { data: reports } = useQuery({
    queryKey: ["reports", query, generate],
    queryFn: () => generateReport(query),
    enabled: generate,
  });

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const exportExcel = () => {
    if (!reports?.data?.tickets) return;

    const worksheet = XLSX.utils.json_to_sheet(
      reports.data.tickets.map((ticket: Ticket) => ({
        "Ticket Title": ticket.title,
        "Assigned User": ticket.assignedUser
          ? `${ticket.assignedUser.firstName} ${ticket.assignedUser.lastName}`
          : "Unassigned",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "ticket-reports.xlsx");
  };

  const handleExit = () => {
    setGenerate(false);
  };

  const ticketCount = reports?.data?.tickets?.length || 0;

  return (
    <PageTemplate>
      {/* Modern gradient background */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Background decoration */}
        <div
          className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e2e8f0" fill-opacity="0.3"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40`}
        ></div>

        {/* Animated blobs */}
        <div className="absolute rounded-full -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute rounded-full -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-pink-500 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Responsive Report Results Modal */}
        {generate && reports && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 duration-300 bg-black bg-opacity-50 sm:p-4 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full h-full sm:h-auto sm:max-w-7xl sm:max-h-[90vh] overflow-hidden duration-500 bg-white border border-gray-200 shadow-2xl rounded-none sm:rounded-2xl animate-in slide-in-from-bottom-4 flex flex-col">
              {/* Modal Header - Fixed */}
              <div className="flex-shrink-0 px-4 py-4 text-white sm:px-8 sm:py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-xl font-bold sm:text-2xl">
                      Report Results
                    </h3>
                    <p className="text-sm text-blue-100">
                      {ticketCount} ticket{ticketCount !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  <button
                    onClick={handleExit}
                    className="p-2 transition-all duration-200 rounded-full hover:bg-white hover:bg-opacity-20 hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content Area - Scrollable */}
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Export Buttons - Fixed */}
                <div className="flex-shrink-0 p-4 pb-4 border-b border-gray-100 sm:p-8">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={exportCSV}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-all duration-200 transform shadow-lg sm:px-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl hover:shadow-xl hover:scale-105 hover:from-emerald-600 hover:to-green-700 sm:text-base"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                      Export CSV
                    </button>
                    <button
                      onClick={exportExcel}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white transition-all duration-200 transform shadow-lg sm:px-6 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl hover:shadow-xl hover:scale-105 hover:from-teal-600 hover:to-cyan-700 sm:text-base"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
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
                      Export Excel
                    </button>
                  </div>
                </div>

                {/* DataTable Container - Scrollable */}
                <div className="flex-1 p-4 pt-0 overflow-auto sm:p-8">
                  <div className="h-full overflow-auto bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="h-full overflow-auto">
                      <DataTable
                        ref={dt}
                        value={reports.data.tickets}
                        paginator
                        rows={ticketCount > 100 ? 20 : 10}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        size="small"
                        className="p-datatable-sm"
                        stripedRows
                        showGridlines
                        scrollable
                        scrollHeight="flex"
                        style={{ minHeight: "300px" }}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
                      >
                        <Column
                          field="title"
                          header="Ticket Title"
                          sortable
                          className="font-medium"
                          style={{ minWidth: "200px" }}
                        />
                        <Column
                          header="Assigned User"
                          body={(rowData) =>
                            rowData.assignedUser ? (
                              <span className="whitespace-nowrap">
                                {`${rowData.assignedUser.firstName} ${rowData.assignedUser.lastName}`}
                              </span>
                            ) : (
                              <span className="italic text-gray-400 whitespace-nowrap">
                                Unassigned
                              </span>
                            )
                          }
                          sortable
                          style={{ minWidth: "150px" }}
                        />
                      </DataTable>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-5xl">
            {/* Modern Card */}
            <div className="overflow-hidden duration-700 border shadow-2xl bg-white/80 backdrop-blur-lg rounded-3xl border-white/20 animate-in slide-in-from-bottom-8">
              {/* Header Section */}
              <div className="px-8 py-8 text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white bg-opacity-20 rounded-2xl">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h1 className="mb-2 text-3xl font-bold">Generate Reports</h1>
                  <p className="text-lg text-blue-100">
                    Create detailed ticket reports with advanced filtering
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Department Dropdown */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Department
                    </label>
                    <Dropdown
                      value={query.deptId}
                      onChange={(e) =>
                        setQuery((prev) => ({ ...prev, deptId: e.value }))
                      }
                      options={departments}
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select a department"
                      className="w-full"
                      style={{
                        borderRadius: "12px",
                        border: "2px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>

                  {/* Status Dropdown */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Status
                    </label>
                    <Dropdown
                      value={query.statusId}
                      onChange={(e) =>
                        setQuery((prev) => ({ ...prev, statusId: e.value }))
                      }
                      options={statuses?.data.statuses}
                      optionLabel="type"
                      optionValue="id"
                      placeholder="Select a status"
                      className="w-full"
                      style={{
                        borderRadius: "12px",
                        border: "2px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Start Date
                    </label>
                    <Calendar
                      value={query.startDate}
                      onChange={(e) =>
                        setQuery((prev) => ({
                          ...prev,
                          startDate: e.value as Date,
                        }))
                      }
                      showIcon
                      dateFormat="yy-mm-dd"
                      className="w-full"
                      style={{
                        borderRadius: "12px",
                        border: "2px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      End Date
                    </label>
                    <Calendar
                      value={query.endDate}
                      onChange={(e) =>
                        setQuery((prev) => ({
                          ...prev,
                          endDate: e.value as Date,
                        }))
                      }
                      showIcon
                      dateFormat="yy-mm-dd"
                      className="w-full"
                      style={{
                        borderRadius: "12px",
                        border: "2px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setGenerate(true)}
                    className="relative flex items-center gap-3 px-8 py-4 font-bold text-white transition-all duration-300 transform shadow-xl group bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:shadow-2xl hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                  >
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
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
                    Generate Report
                    <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 -z-10"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ReportsPage;
