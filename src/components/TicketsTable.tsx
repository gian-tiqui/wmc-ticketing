import React from "react";
import { Ticket } from "../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { useNavigate } from "react-router-dom";

interface Props {
  tickets: Ticket[];
}

const TicketsTable: React.FC<Props> = ({ tickets }) => {
  const navigate = useNavigate();

  return (
    <div>
      <DataTable
        value={tickets}
        paginator
        rows={4}
        size="small"
        pt={{
          bodyRow: { className: "bg-slate-900" },
          headerRow: { className: "bg-slate-900" },
          paginator: { root: { className: "bg-slate-900" } },
        }}
      >
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          className="text-slate-100"
          header="Ticket Number"
          field="id"
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          className="text-slate-100"
          header="Title"
          field="title"
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          className="text-slate-100"
          header="Category"
          body={(rowData: Ticket) => <p>{rowData.category.name}</p>}
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          className="text-slate-100"
          header="Requested At"
          field="createdAt"
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          className="text-slate-100"
          header="From Department"
          body={(rowData: Ticket) => <p>{rowData.issuer.department.name}</p>}
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          className="text-slate-100"
          header="Assigned to"
          body={(rowData: Ticket) =>
            rowData.assignedUser ? (
              <p>{rowData.assignedUser.firstName}</p>
            ) : (
              <p>None</p>
            )
          }
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          className="text-slate-100"
          header="Priority"
          body={(rowData: Ticket) => <p>{rowData.priorityLevel.name}</p>}
        ></Column>

        <Column
          header="Action"
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          className="text-slate-100"
          body={(rowData: Ticket) => (
            <Button
              icon={PrimeIcons.DIRECTIONS}
              className="w-10 h-10 rounded-full"
              onClick={() => {
                navigate(`/ticket/${rowData.id}`);
              }}
            ></Button>
          )}
        ></Column>
      </DataTable>
    </div>
  );
};

export default TicketsTable;
