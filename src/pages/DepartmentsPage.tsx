import { useQuery } from "@tanstack/react-query";
import PageTemplate from "../templates/PageTemplate";
import { useState } from "react";
import { Query } from "../types/types";
import { getDepartments } from "../@utils/services/departmentService";
import DepartmentsTable from "../components/DepartmentsTable";
import DepartmentsHeader from "../components/DepartmentsHeader";

const DepartmentsPage = () => {
  const [query] = useState<Query>({ search: "", limit: 100 });
  const {
    data: departmentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [`departments-${JSON.stringify(query)}`],
    queryFn: () => getDepartments(query),
  });

  return (
    <PageTemplate>
      <DepartmentsHeader refetch={refetch} />
      <DepartmentsTable
        refetch={refetch}
        departments={departmentsData}
        isError={isError}
        isLoading={isLoading}
        error={error}
      />
    </PageTemplate>
  );
};

export default DepartmentsPage;
