import React, { useEffect, useState, useCallback } from "react";
import { Department } from "../types/types";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import UpdateDepartmentDialog from "./UpdateDepartmentDailog";
import AddDepartmentDialog from "./AddDepartmentDialog";
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
  isExpanded?: boolean;
}

// Move components OUTSIDE the main component to prevent re-creation
const SearchButton = React.memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="relative z-20">
      <InputText
        value={value}
        onChange={onChange}
        placeholder="Search departments..."
        className="py-2 pl-10 pr-4 text-sm text-white placeholder-blue-100 transition-all duration-200 border rounded-lg bg-white/20 backdrop-blur-sm border-white/20 focus:bg-white/30 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
        autoComplete="off"
        spellCheck="false"
      />
      <i
        className={`${PrimeIcons.SEARCH} absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100 text-sm pointer-events-none`}
      />
    </div>
  )
);

const ClearFilterButton = React.memo(({ onClick }: { onClick: () => void }) => (
  <Button
    icon={PrimeIcons.FILTER_SLASH}
    className="w-10 h-10 p-0 text-white transition-all duration-200 border rounded-lg bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm"
    onClick={onClick}
    tooltip="Clear Filters"
    tooltipOptions={{ position: "bottom" }}
  />
));

const AddDepartmentButton = React.memo(
  ({ onClick }: { onClick: () => void }) => (
    <Button
      icon={PrimeIcons.PLUS}
      className="w-10 h-10 p-0 text-white transition-all duration-200 border rounded-lg bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm"
      onClick={onClick}
      tooltip="Add Department"
      tooltipOptions={{ position: "bottom" }}
    />
  )
);

const DepartmentsTable: React.FC<Props> = ({
  departments,
  isLoading,
  isError,
  refetch,
  isExpanded = true,
}) => {
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deptId, setDeptId] = useState<number | null>(null);
  const [updateDialogVisible, setUpdateDialogVisible] =
    useState<boolean>(false);
  const [addDialogVisible, setAddDialogVisible] = useState<boolean>(false);

  useEffect(() => {
    if (deptId !== null) setUpdateDialogVisible(true);
  }, [deptId]);

  const initFilters = useCallback(() => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code: { value: null, matchMode: FilterMatchMode.CONTAINS },
      createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
      updatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  }, []);

  useEffect(() => {
    initFilters();
  }, [initFilters]);

  const onGlobalFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilters((prev) => ({
        ...prev,
        global: { value, matchMode: FilterMatchMode.CONTAINS },
      }));
      setGlobalFilterValue(value);
    },
    []
  );

  const clearFilter = useCallback(() => {
    initFilters();
  }, [initFilters]);

  const nameBodyTemplate = useCallback(
    (rowData: Department) => (
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
          <span className="text-xs font-semibold text-white">
            {rowData.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{rowData.name}</div>
          <div className="text-xs text-gray-500">Department</div>
        </div>
      </div>
    ),
    []
  );

  const codeBodyTemplate = useCallback(
    (rowData: Department) => (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {rowData.code}
      </span>
    ),
    []
  );

  const dateBodyTemplate = useCallback(
    (dateString: string) => (
      <div className="text-sm text-gray-700">{dateString}</div>
    ),
    []
  );

  const actionBodyTemplate = useCallback(
    (rowData: Department) => (
      <div className="flex items-center gap-2">
        <Button
          icon={PrimeIcons.COG}
          className="w-8 h-8 p-0 text-gray-600 transition-all duration-200 bg-gray-100 border-0 rounded-lg hover:bg-gray-200 hover:text-gray-800"
          onClick={() => setDeptId(rowData.id)}
          tooltip="Edit Department"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    ),
    []
  );

  const handleAddDepartment = useCallback(() => {
    setAddDialogVisible(true);
  }, []);

  const scrollbarTheme =
    "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100";

  const departmentsTableContent = (
    <div className="animate-fadeIn">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block w-8 h-8 mb-3 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-600">
              Loading departments...
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full">
              <i
                className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-600 text-xl`}
              />
            </div>
            <p className="text-sm font-medium text-red-600">
              Failed to load departments
            </p>
            <p className="mt-1 text-xs text-gray-500">Please try again later</p>
          </div>
        </div>
      ) : (
        <DataTable
          value={departments}
          paginator
          rows={10}
          size="small"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={["name", "code", "createdAt", "updatedAt"]}
          emptyMessage={
            <div className="py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <i
                  className={`${PrimeIcons.BUILDING} text-gray-400 text-2xl`}
                />
              </div>
              <p className="font-medium text-gray-600">No departments found</p>
              <p className="mt-1 text-sm text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          }
          loading={isLoading}
          className="text-sm"
          pt={{
            bodyRow: {
              className:
                "hover:bg-slate-50 transition-colors duration-200 border-b border-slate-200/50",
            },
            headerRow: {
              className: "bg-slate-50 border-b border-slate-200",
            },
            header: {
              className:
                "text-gray-700 font-semibold text-xs uppercase tracking-wider py-4 px-6",
            },
            paginator: {
              root: {
                className: "bg-slate-50 border-t border-slate-200/50 px-6 py-4",
              },
            },
            root: {
              className: "text-sm border-0 bg-white rounded-lg shadow-sm",
            },
          }}
        >
          <Column
            header="Department"
            field="name"
            filterPlaceholder="Search by name"
            body={nameBodyTemplate}
            pt={{
              filterInput: {
                className:
                  "text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
              },
            }}
            style={{ minWidth: "14rem" }}
          />
          <Column
            header="Code"
            field="code"
            filterPlaceholder="Search by code"
            body={codeBodyTemplate}
            pt={{
              filterInput: {
                className:
                  "text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
              },
            }}
            style={{ minWidth: "8rem" }}
          />
          <Column
            header="Created"
            field="createdAt"
            filterPlaceholder="Search by date"
            body={(rowData: Department) => dateBodyTemplate(rowData.createdAt)}
            pt={{
              filterInput: {
                className:
                  "text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
              },
            }}
            style={{ minWidth: "12rem" }}
          />
          <Column
            header="Updated"
            field="updatedAt"
            filterPlaceholder="Search by date"
            body={(rowData: Department) => dateBodyTemplate(rowData.updatedAt)}
            pt={{
              filterInput: {
                className:
                  "text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200",
              },
            }}
            style={{ minWidth: "12rem" }}
          />
          <Column
            header="Actions"
            body={actionBodyTemplate}
            pt={{
              headerCell: {
                className:
                  "bg-slate-50 text-gray-700 font-semibold text-xs uppercase tracking-wider py-4 px-6",
              },
            }}
            style={{ minWidth: "6rem" }}
          />
        </DataTable>
      )}
    </div>
  );

  const tabs = [
    {
      header: `All Departments (${departments?.length || 0})`,
      body: departmentsTableContent,
    },
  ];

  return (
    <div className="w-full h-full bg-[#EEE]">
      {/* Header Section */}
      <div className="relative p-6 mb-8 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                <i className={`${PrimeIcons.BUILDING} text-white text-xl`} />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold text-white ${
                    !isExpanded && "ms-14"
                  }`}
                >
                  Department Management
                </h1>
                <p className="mt-1 text-sm text-blue-100">
                  Organize and manage your company departments
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <SearchButton
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
              />
              <ClearFilterButton onClick={clearFilter} />
              <AddDepartmentButton onClick={handleAddDepartment} />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute w-24 h-24 rounded-full -top-4 -right-4 bg-white/5 blur-xl" />
        <div className="absolute w-32 h-32 rounded-full -bottom-8 -left-8 bg-white/5 blur-2xl" />
      </div>

      {/* Content Section */}
      <div className="px-6 pb-6">
        <TabView
          pt={{
            panelContainer: {
              className: `${scrollbarTheme} h-[67vh] overflow-auto w-full bg-[#EEE]`,
            },
            nav: {
              className:
                "w-full bg-transparent border-b border-slate-200/50 px-6 pt-6",
            },
            tab: {
              className: "mx-1",
            },
            navContent: {
              className: "flex gap-2",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <TabPanel
              key={index}
              pt={{
                headerAction: {
                  className:
                    "px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-100/80 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg",
                },
              }}
              header={tab.header}
              headerClassName="text-sm font-medium"
            >
              {tab.body}
            </TabPanel>
          ))}
        </TabView>
      </div>

      {/* Dialogs */}
      <UpdateDepartmentDialog
        refetch={refetch}
        id={deptId}
        setId={setDeptId}
        setVisible={setUpdateDialogVisible}
        visible={updateDialogVisible}
      />

      <AddDepartmentDialog
        visible={addDialogVisible}
        setVisible={setAddDialogVisible}
        refetch={refetch}
      />
    </div>
  );
};

export default DepartmentsTable;
