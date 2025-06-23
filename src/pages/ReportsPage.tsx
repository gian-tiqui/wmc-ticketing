import { useQuery } from "@tanstack/react-query";
import PageTemplate from "../templates/PageTemplate";
import { generateReport } from "../@utils/services/reportService";
import { useRef, useState } from "react";
import { Query, Ticket } from "../types/types";
import { getDepartments } from "../@utils/services/departmentService";
import { getAllStatus } from "../@utils/services/statusService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
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

  return (
    <PageTemplate>
      {generate && reports && (
        <div className="absolute z-50 p-6 mx-auto mt-10 -translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow-md top-1/2 left-1/2 w-[90%] max-w-5xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Report Results</h3>
            <Button
              label="Exit"
              icon="pi pi-times"
              onClick={handleExit}
              className="p-button-danger"
            />
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              label="Export CSV"
              icon="pi pi-file"
              onClick={exportCSV}
              className="bg-green-600 border-green-600 hover:bg-green-700"
            />
            <Button
              label="Export Excel"
              icon="pi pi-file-excel"
              onClick={exportExcel}
              className="bg-green-700 border-green-700 hover:bg-green-800"
            />
          </div>

          <DataTable
            ref={dt}
            value={reports.data.tickets}
            paginator
            rows={10}
            size="small"
            className="p-datatable-sm"
          >
            <Column field="title" header="Ticket Title" sortable />
            <Column
              header="Assigned User"
              body={(rowData) =>
                rowData.assignedUser
                  ? `${rowData.assignedUser.firstName} ${rowData.assignedUser.lastName}`
                  : "Unassigned"
              }
              sortable
            />
          </DataTable>
        </div>
      )}

      {/* Filter Form */}
      <div className="flex items-center justify-center w-full h-screen">
        <div className="max-w-4xl p-6 space-y-6 bg-white border rounded shadow-md">
          <h2 className="text-xl font-semibold">Generate Reports</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Department Dropdown */}
            <div>
              <label className="text-sm font-medium">Department</label>
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
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="text-sm font-medium">Status</label>
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
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Calendar
                value={query.startDate}
                onChange={(e) =>
                  setQuery((prev) => ({ ...prev, startDate: e.value as Date }))
                }
                showIcon
                dateFormat="yy-mm-dd"
                className="w-full"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Calendar
                value={query.endDate}
                onChange={(e) =>
                  setQuery((prev) => ({ ...prev, endDate: e.value as Date }))
                }
                showIcon
                dateFormat="yy-mm-dd"
                className="w-full"
              />
            </div>
          </div>

          <Button
            label="Generate Report"
            icon="pi pi-search"
            onClick={() => setGenerate(true)}
            className="mt-4 bg-blue-600 border-blue-600 hover:bg-blue-700"
          />
        </div>
      </div>
    </PageTemplate>
  );
};

export default ReportsPage;
