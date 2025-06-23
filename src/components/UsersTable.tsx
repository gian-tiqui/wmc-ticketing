import React, { useEffect, useState } from "react";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableFilterMetaData,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
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

  const header = (
    <div className="flex justify-between items-center bg-[#fff] pb-5 rounded-t-lg pt-2 px-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-blue-600">Users</span>
        <span className="text-sm text-gray-500">
          ({users?.length || 0} users)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search users..."
          className="h-8 px-4 text-sm"
        />
        <Button
          onClick={initFilters}
          className="h-8 px-3 text-xs border rounded p-button-outlined p-button-sm hover:bg-gray-50"
        >
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <div className="b-8 ">
      {header}

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
        paginator
        rows={6}
        filters={filters}
        filterDisplay="row"
        globalFilterFields={["firstName", "lastName", "department.code"]}
        emptyMessage="No users found."
        className="text-sm"
        pt={{
          bodyRow: { className: "bg-[#EEEEEE]" },
          headerRow: { className: "bg-[#EEEEEE]" },
          paginator: { root: { className: "bg-[#EEEEEE] rounded-b-lg" } },
          root: { className: "text-xs shadow" },
        }}
      >
        <Column
          header="First Name"
          field="firstName"
          filter
          filterPlaceholder="Search by first name"
          pt={{ filterInput: { className: "text-xs" } }}
        />
        <Column
          header="Last Name"
          field="lastName"
          filter
          filterPlaceholder="Search by last name"
          pt={{ filterInput: { className: "text-xs" } }}
        />
        <Column
          header="Department"
          field="department.code"
          filter
          filterPlaceholder="Search by department"
          pt={{ filterInput: { className: "text-xs" } }}
          body={(rowData: User) => <p>{rowData.department?.code || "None"}</p>}
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
