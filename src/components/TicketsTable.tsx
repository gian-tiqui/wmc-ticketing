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
          bodyRow: { className: "bg-[#EEEEEE]" },
          headerRow: { className: "bg-[#EEEEEE]" },
          paginator: {
            root: { className: "bg-[#EEEEEE]" },
          },

          root: { className: "text-xs" },
        }}
      >
        <Column
          pt={{
            headerCell: { className: "bg-white h-14" },
            sortIcon: { className: "" },
          }}
          className=""
          header="Ticket Number"
          field="id"
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-white h-14 " },
            sortIcon: { className: "" },
          }}
          className=""
          header="Title"
          field="title"
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-white h-14 " },
            sortIcon: { className: "" },
          }}
          className=""
          header="Category"
          body={(rowData: Ticket) => <p>{rowData.category.name}</p>}
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-white h-14 " },
            sortIcon: { className: "" },
          }}
          className=""
          header="Requested At"
          field="createdAt"
        ></Column>

        <Column
          pt={{
            headerCell: { className: "bg-white h-14 " },
            sortIcon: { className: "" },
          }}
          className=""
          header="Assigned to"
          body={(rowData: Ticket) =>
            rowData.assignedUser ? (
              <p>
                {rowData.assignedUser.firstName} {rowData.assignedUser.lastName}
              </p>
            ) : (
              <p>None</p>
            )
          }
        ></Column>
        <Column
          pt={{
            headerCell: { className: "bg-white h-14 " },
            sortIcon: { className: "" },
          }}
          className=""
          header="Priority"
          body={(rowData: Ticket) => <p>{rowData.priorityLevel.name}</p>}
        ></Column>

        <Column
          header="Action"
          pt={{
            headerCell: { className: "bg-white h-14 " },
            sortIcon: { className: "" },
          }}
          className=""
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
