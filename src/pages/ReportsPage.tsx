import { useQuery } from "@tanstack/react-query";
import PageTemplate from "../templates/PageTemplate";
import { generateReport } from "../@utils/services/reportService";
import { useState } from "react";
import { Query } from "../types/types";
import { getDepartments } from "../@utils/services/departmentService";
import { getAllStatus } from "../@utils/services/statusService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

const ReportsPage = () => {
  const [query, setQuery] = useState<Query>({});

  const [generate, setGenerate] = useState(false);

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

  return (
    <PageTemplate>
      <div className="max-w-3xl p-6 mx-auto mt-10 space-y-6 bg-white border rounded shadow-md">
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

        {reports && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-medium">Report Results:</h3>
            <pre className="p-4 overflow-auto text-sm bg-gray-100 rounded max-h-64">
              {JSON.stringify(reports.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default ReportsPage;
