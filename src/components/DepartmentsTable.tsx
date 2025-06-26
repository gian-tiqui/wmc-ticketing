import React, { useEffect, useState } from "react";
import { Department } from "../types/types";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import UpdateDepartmentDialog from "./UpdateDepartmentDailog";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Props {
  departments: Department[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Department>, Error>>;
}

const DepartmentsTable: React.FC<Props> = ({
  departments,
  isLoading,
  isError,
  error,
  refetch,
}) => {
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deptId, setDeptId] = useState<number | null>(null);
  const [updateDialogVisible, setUpdateDialogVisible] =
    useState<boolean>(false);

  useEffect(() => {
    initFilters();
  }, []);

  useEffect(() => {
    if (deptId !== null) setUpdateDialogVisible(true);
  }, [deptId]);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code: { value: null, matchMode: FilterMatchMode.CONTAINS },
      createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
      updatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const clearFilter = () => {
    initFilters();
  };

  if (isLoading) return <small>Loading Departments.</small>;

  if (isError) {
    console.error(error);

    return (
      <small>
        There was a problem in loading departments. Try again later.
      </small>
    );
  }

  const header = (
    <div className="flex justify-between items-center bg-[#fff] pb-5 rounded-t-lg pt-2 px-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-blue-600">Departments</span>
        <span className="text-sm text-gray-500">
          ({departments?.length || 0} departments)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search departments..."
          className="h-8 px-4 text-sm"
        />
        <Button
          onClick={clearFilter}
          className="h-8 px-3 text-xs border rounded p-button-outlined p-button-sm hover:bg-gray-50"
        >
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <div className="px-4 pb-8">
      {header}

      <UpdateDepartmentDialog
        refetch={refetch}
        id={deptId}
        setId={setDeptId}
        setVisible={setUpdateDialogVisible}
        visible={updateDialogVisible}
      />
      <DataTable
        value={departments}
        paginator
        rows={8}
        size="small"
        filters={filters}
        filterDisplay="row"
        globalFilterFields={["name", "code", "createdAt", "updatedAt"]}
        emptyMessage="No departments found."
        loading={isLoading}
        className="text-sm"
        pt={{
          bodyRow: { className: "bg-[#EEEEEE]" },
          headerRow: { className: "bg-[#EEEEEE]" },
          paginator: { root: { className: "bg-[#EEEEEE] rounded-b-lg" } },
          root: { className: "text-xs shadow" },
        }}
      >
        <Column
          header="Name"
          field="name"
          filterPlaceholder="Search name"
          pt={{ filterInput: { className: "text-xs" } }}
          style={{ minWidth: "10rem" }}
        />
        <Column
          header="Code"
          field="code"
          filterPlaceholder="Search code"
          pt={{ filterInput: { className: "text-xs" } }}
          style={{ minWidth: "6rem" }}
        />
        <Column
          header="Created At"
          field="createdAt"
          filterPlaceholder="Search created date"
          pt={{ filterInput: { className: "text-xs" } }}
          body={(rowData: Department) => rowData.createdAt}
          style={{ minWidth: "12rem" }}
        />
        <Column
          header="Updated At"
          field="updatedAt"
          filterPlaceholder="Search updated date"
          pt={{ filterInput: { className: "text-xs" } }}
          body={(rowData: Department) => rowData.updatedAt}
          style={{ minWidth: "12rem" }}
        />
        <Column
          header="Actions"
          body={(rowData: Department) => (
            <Button
              icon={PrimeIcons.COG}
              className="p-0 p-button p-button-text"
              onClick={() => {
                setDeptId(rowData.id);
              }}
            />
          )}
          pt={{ headerCell: { className: "bg-white" } }}
        />
      </DataTable>
    </div>
  );
};

export default DepartmentsTable;
