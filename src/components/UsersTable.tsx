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
    <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-white to-slate-50 rounded-t-2xl border-slate-200/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Users
          </span>
        </div>
        <div className="px-3 py-1 rounded-full bg-slate-100">
          <span className="text-sm font-medium text-slate-600">
            {users?.length || 0} total
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 transition-colors text-slate-400 group-hover:text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search users..."
            className="h-10 pl-10 pr-4 text-sm transition-all duration-200 shadow-sm bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <Button
          onClick={initFilters}
          className="h-10 px-4 text-sm font-medium transition-all duration-200 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 hover:shadow-md focus:ring-2 focus:ring-slate-500/20 text-slate-700"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden bg-white border shadow-xl rounded-2xl shadow-slate-200/50 border-slate-200/50">
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
        emptyMessage={
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <p className="font-medium text-slate-600">No users found</p>
            <p className="mt-1 text-sm text-slate-400">
              Try adjusting your search criteria
            </p>
          </div>
        }
        className="text-sm"
        pt={{
          bodyRow: {
            className:
              "bg-white hover:bg-slate-50/50 transition-colors duration-150 border-b border-slate-100/50",
          },
          headerRow: {
            className:
              "bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200",
          },
          paginator: {
            root: {
              className:
                "bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-b-2xl border-t border-slate-200/50 p-4",
            },
          },
          root: {
            className: "text-xs shadow-none border-none",
          },
        }}
      >
        <Column
          header={
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              First Name
            </div>
          }
          field="firstName"
          filterPlaceholder="Search first name..."
          pt={{
            filterInput: {
              className:
                "text-xs h-8 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20",
            },
          }}
        />

        <Column
          header={
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Last Name
            </div>
          }
          field="lastName"
          filterPlaceholder="Search last name..."
          pt={{
            filterInput: {
              className:
                "text-xs h-8 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20",
            },
          }}
        />

        <Column
          header={
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Department
            </div>
          }
          field="department.code"
          filterPlaceholder="Search department..."
          pt={{
            filterInput: {
              className:
                "text-xs h-8 rounded-lg border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20",
            },
          }}
          body={(rowData: User) => (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="font-medium text-slate-700">
                {rowData.department?.code || (
                  <span className="italic text-slate-400">No department</span>
                )}
              </span>
            </div>
          )}
        />

        <Column
          header={
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
              Actions
            </div>
          }
          body={(rowData: User) => (
            <div className="flex items-center justify-center">
              <Button
                icon={PrimeIcons.COG}
                className="p-2 transition-all duration-200 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 hover:shadow-md focus:ring-2 focus:ring-slate-500/20"
                onClick={() => setSelectedId(rowData.id)}
                tooltip="Edit user"
                tooltipOptions={{ position: "top" }}
              />
            </div>
          )}
          pt={{
            headerCell: {
              className: "bg-gradient-to-r from-slate-50 to-slate-100/50",
            },
          }}
        />
      </DataTable>
    </div>
  );
};

export default UsersTable;
