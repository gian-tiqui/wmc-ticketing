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
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Props {
  users: User[];
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<User>, Error>>;
}

const UsersTable: React.FC<Props> = ({ users, refetch }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({});

  useEffect(() => {
    initFilters();
  }, []);

  useEffect(() => {
    if (selectedId !== null) setVisible(true);
  }, [selectedId]);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      "department.code": { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    (_filters["global"] as DataTableFilterMetaData).value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-2">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
          className="h-10 text-xs border-black rounded-full"
        />
      </IconField>
      <Button
        onClick={initFilters}
        className="h-10 px-5 text-xs border p-button-outlined hover:bg-gray-50 rounded-3xl"
      >
        Clear
      </Button>
    </div>
  );

  return (
    <div>
      <UpdateUserDialog
        refetch={refetch}
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
        filterDisplay="row"
        globalFilterFields={["firstName", "lastName", "department.code"]}
        header={renderHeader()}
        emptyMessage="No users found."
        pt={{
          bodyRow: { className: "bg-[#EEEEEE]" },
          headerRow: { className: "bg-white" },
          paginator: {
            root: { className: "bg-[#EEEEEE] rounded-b-3xl" },
          },
          root: { className: "text-xs" },
          header: { className: "bg-white border-none rounded-t-3xl" },
        }}
      >
        <Column
          header="First Name"
          field="firstName"
          filter
          filterPlaceholder="Search by first name"
          pt={{ headerCell: { className: "bg-white" } }}
        />
        <Column
          header="Last Name"
          field="lastName"
          filter
          filterPlaceholder="Search by last name"
          pt={{ headerCell: { className: "bg-white" } }}
        />
        <Column
          header="Department"
          field="department.code"
          filter
          filterPlaceholder="Search by department"
          body={(rowData) => <p>{rowData.department?.code || "None"}</p>}
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
