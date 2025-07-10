import React, { useState } from "react";
import { Button } from "primereact/button";
import AddDepartmentDialog from "./AddDepartmentDialog";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Department } from "../types/types";

interface Props {
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Department>, Error>>;
}

const DepartmentsHeader: React.FC<Props> = ({ refetch }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <i className="text-xl text-white pi pi-building"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Department Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Organize and manage your company departments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon="pi pi-plus"
            label="Add Department"
            className="px-6 py-3 font-medium text-white transition-all duration-200 transform border-0 rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105"
            onClick={() => setVisible(true)}
          />
        </div>
      </div>

      <AddDepartmentDialog
        visible={visible}
        setVisible={setVisible}
        refetch={refetch}
      />
    </div>
  );
};

export default DepartmentsHeader;
