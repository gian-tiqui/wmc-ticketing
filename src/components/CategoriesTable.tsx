import { useQuery } from "@tanstack/react-query";
import useUserDataStore from "../@utils/store/userDataStore";
import { getDepartmentCategoriesByDeptId } from "../@utils/services/departmentService";
import { Category } from "../types/types";

const CategoriesTable = () => {
  const { user } = useUserDataStore();
  const { data } = useQuery({
    queryKey: [`department-categories-${user?.deptId}`],
    queryFn: () =>
      getDepartmentCategoriesByDeptId(user?.deptId, { limit: 100 }),
    enabled: !!user && user != undefined,
  });

  return (
    <div className="flex flex-col gap-2 px-4">
      {data?.data.categories &&
        data?.data.categories.map((category: Category) => (
          <div key={category.id}>{JSON.stringify(category)}</div>
        ))}
    </div>
  );
};

export default CategoriesTable;
