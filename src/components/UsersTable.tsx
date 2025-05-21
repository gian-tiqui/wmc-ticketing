import React, { useEffect, useState } from "react";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableFilterMetaData,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { User } from "../types/types";
import UpdateUserDialog from "./UpdateUserDialog";
import { Button } from "primereact/button";

interface Props {
  users: User[];
}

const UsersTable: React.FC<Props> = ({ users }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  useEffect(() => {
    if (selectedId !== null) setVisible(true);
  }, [selectedId]);

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    (_filters["global"] as DataTableFilterMetaData).value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-end mb-2">
        <IconField iconPosition="left" className="">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            className="h-10 text-xs border-black rounded-full"
          />
        </IconField>
      </div>
    );
  };

  return (
    <div>
      <UpdateUserDialog
        visible={visible}
        setVisible={setVisible}
        id={selectedId}
        setId={setSelectedId}
      />
      <DataTable
        value={users}
        size="small"
        className="text-sm"
        paginator
        rows={6}
        filters={filters}
        globalFilterFields={["firstName", "lastName"]}
        header={renderHeader()}
        pt={{
          bodyRow: { className: "bg-[#EEEEEE]" },
          headerRow: { className: "bg-white" },
          paginator: {
            root: { className: "bg-[#EEEEEE] rounded-b-3xl" },
          },
          root: { className: "text-xs" },
          header: { className: "bg-white border-none rounded-t-3xl " },
        }}
      >
        <Column
          header="First Name"
          field="firstName"
          pt={{ headerCell: { className: "bg-white" } }}
        />
        <Column
          header="Last Name"
          field="lastName"
          pt={{ headerCell: { className: "bg-white" } }}
        />
        <Column
          header="Department"
          body={(rowData) => {
            return <p>{rowData.department.code}</p>;
          }}
          pt={{ headerCell: { className: "bg-white" } }}
        />
        <Column
          header="Actions"
          body={(rowData: User) => (
            <Button
              icon={PrimeIcons.COG}
              className="p-0 p-button p-button-text"
              onClick={() => setSelectedId(rowData.id)}
            />
          )}
          pt={{ headerCell: { className: "bg-white" } }}
        />
      </DataTable>
    </div>
  );
};

export default UsersTable;
