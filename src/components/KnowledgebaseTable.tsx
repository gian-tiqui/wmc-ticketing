import { useQuery } from "@tanstack/react-query";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
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

  // Responsive header component
  const header = (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#fff] pb-5 rounded-t-lg pt-2 px-2 gap-3">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-blue-600 sm:text-lg">
          Knowledgebase
        </span>
        <span className="text-xs text-gray-500 sm:text-sm">
          ({tickets.length} tickets)
        </span>
      </div>
      <div className="flex flex-col items-stretch w-full gap-2 xs:flex-row xs:items-center sm:w-auto">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search tickets..."
          className="h-8 px-3 text-sm flex-1 xs:flex-initial xs:min-w-[200px]"
        />
        <Button
          onClick={initFilters}
          className="h-8 px-3 text-xs border rounded p-button-outlined p-button-sm hover:bg-gray-50 whitespace-nowrap"
        >
          Clear
        </Button>
      </div>
    </div>
  );

  // Responsive body template for mobile cards
  const mobileCardTemplate = (rowData: Ticket) => (
    <div className="p-4 mb-3 bg-white border rounded-lg shadow-sm">
      <div className="space-y-2">
        <div className="text-sm font-semibold text-blue-600 break-words">
          {rowData.title}
        </div>

        {rowData.resolution && (
          <div className="text-xs text-gray-600 break-words">
            <span className="font-medium">Resolution:</span>{" "}
            {rowData.resolution}
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 text-blue-800 bg-blue-100 rounded">
            {rowData.status?.type || "—"}
          </span>
          <span className="px-2 py-1 text-gray-800 bg-gray-100 rounded">
            {rowData.category?.name || "—"}
          </span>
          <span className="px-2 py-1 text-green-800 bg-green-100 rounded">
            {rowData.department?.code || "—"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-gray-600 border-t">
          <div>
            <span className="font-medium">Issuer:</span>
            <div>
              {`${rowData.issuer?.firstName || ""} ${
                rowData.issuer?.lastName || ""
              }`.trim() || "—"}
            </div>
          </div>
          <div>
            <span className="font-medium">Assigned:</span>
            <div>
              {rowData.assignedUser
                ? `${rowData.assignedUser.firstName} ${rowData.assignedUser.lastName}`
                : "Unassigned"}
            </div>
          </div>
          <div className="col-span-2">
            <span className="font-medium">Created:</span>{" "}
            {formatDate(rowData.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <small>Loading tickets...</small>;
  if (isError) return <small>Error: {error?.message}</small>;

  return (
    <div className="px-2 pt-4 pb-8 sm:px-4">
      {header}

      {/* Mobile view - Card layout */}
      <div className="block lg:hidden">
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No tickets found.
            </div>
          ) : (
            tickets.map((ticket, index) => (
              <div key={ticket.id || index}>{mobileCardTemplate(ticket)}</div>
            ))
          )}
        </div>
      </div>

      {/* Desktop view - Table layout */}
      <div className="hidden w-full overflow-x-auto lg:block">
        <DataTable
          value={tickets}
          paginator
          rows={8}
          scrollable
          scrollHeight="60vh"
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
          emptyMessage="No tickets found."
          loading={isLoading}
          className="min-w-[1024px] text-sm"
          pt={{
            bodyRow: { className: "bg-[#EEEEEE]" },
            headerRow: { className: "bg-[#EEEEEE]" },
            paginator: { root: { className: "bg-[#EEEEEE] rounded-b-lg" } },
            root: { className: "text-xs shadow" },
          }}
        >
          <Column
            header="Title"
            field="title"
            filter
            filterPlaceholder="Search title"
            style={{ minWidth: "200px", maxWidth: "300px" }}
            bodyStyle={{ wordBreak: "break-word" }}
            pt={{ filterInput: { className: "text-xs" } }}
          />

          <Column
            header="Category"
            field="category.name"
            filter
            filterPlaceholder="Search category"
            body={(rowData: Ticket) => rowData.category?.name || "—"}
            style={{ minWidth: "150px" }}
            pt={{ filterInput: { className: "text-xs" } }}
          />

          <Column
            header="Issuer"
            body={(rowData: Ticket) =>
              `${rowData.issuer?.firstName || ""} ${
                rowData.issuer?.lastName || ""
              }`.trim() || "—"
            }
            style={{ minWidth: "150px" }}
          />
          <Column
            header="Assigned"
            body={(rowData: Ticket) =>
              rowData.assignedUser
                ? `${rowData.assignedUser.firstName} ${rowData.assignedUser.lastName}`
                : "Unassigned"
            }
            style={{ minWidth: "150px" }}
          />
          <Column
            header="Action"
            body={(rowData: Ticket) => {
              return (
                <Link to={`/ticket/${rowData.id}/knowledgebase`}>
                  <i className={`${PrimeIcons.ARROW_UP_RIGHT}`}></i>
                </Link>
              );
            }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default KnowledgebaseTable;
