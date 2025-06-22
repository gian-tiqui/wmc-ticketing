import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import React, { useState } from "react";
import AddDepartmentDialog from "./AddDepartmentDialog";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Department } from "../types/types";

interface Props {
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Department>, Error>>;
}

const DepartmentsHeader: React.FC<Props> = ({ refetch }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <header className="flex justify-between w-full p-4">
      <AddDepartmentDialog
        visible={visible}
        setVisible={setVisible}
        refetch={refetch}
      />
      <h4 className="font-medium text-blue-600">Manage the Departments</h4>
      <Button
        icon={`${PrimeIcons.PLUS_CIRCLE} text-xs`}
        className="bg-blue-600 h-7 w-7"
        onClick={() => setVisible(true)}
      />
    </header>
  );
};

export default DepartmentsHeader;
