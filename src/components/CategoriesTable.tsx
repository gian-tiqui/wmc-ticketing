import { useQuery } from "@tanstack/react-query";
import useUserDataStore from "../@utils/store/userDataStore";
import { getDepartmentCategoriesByDeptId } from "../@utils/services/departmentService";
import { Column } from "primereact/column";
import { TreeTable } from "primereact/treetable";
import { Category } from "../types/types";
import { TreeNode } from "primereact/treenode";
import { useEffect, useState } from "react";
import CategorySettingsDialog from "./CategorySettingsDialog";
import { PrimeIcons } from "primereact/api";

const convertToTreeNodes = (categories: Category[]): TreeNode[] => {
  return categories.map((category) => ({
    key: String(category.id),
    data: {
      name: category.name,
      SLA: category.SLA,
      id: category.id,
    },
    children: category.subCategories?.length
      ? convertToTreeNodes(category.subCategories)
      : undefined,
  }));
};

const CategoriesTable = () => {
  const { user } = useUserDataStore();
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [`department-categories-${user?.deptId}`],
    queryFn: () =>
      getDepartmentCategoriesByDeptId(user?.deptId, { limit: 100 }),
    enabled: !!user && user != undefined,
  });

  useEffect(() => {
    if (selectedId && selectedId > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!visible) setSelectedId(0);
  }, [visible]);

  if (isLoading) {
    return <small className="mx-4">Loading categories..</small>;
  }

  if (isError) {
    console.error(error);
    return (
      <small className="mx-4">There was a problem in loading categories</small>
    );
  }

  return (
    <div className="px-4">
      <CategorySettingsDialog
        refetch={refetch}
        categoryId={selectedId}
        visible={visible}
        setVisible={setVisible}
      />
      {data?.data.categories && (
        <>
          <header className="w-full h-4 bg-white rounded-t-3xl"></header>
          <TreeTable
            pt={{
              headerRow: { className: "bg-[#EEEEEE]" },
              paginator: {
                root: { className: "bg-[#EEEEEE] rounded-b-3xl" },
              },

              root: { className: "text-xs" },
            }}
            paginator
            rows={4}
            value={convertToTreeNodes(data.data.categories)}
          >
            <Column
              field="name"
              header="Category Name"
              expander
              pt={{
                headerCell: { className: "bg-white h-14" },
                sortIcon: { className: "" },
              }}
            />
            <Column
              field="SLA"
              header="SLA"
              pt={{
                headerCell: { className: "bg-white h-14 " },
                sortIcon: { className: "" },
              }}
            />
            <Column
              header="Action"
              pt={{
                headerCell: { className: "bg-white h-14 " },
                sortIcon: { className: "" },
              }}
              body={(rowData) => {
                return (
                  <span
                    onClick={() => {
                      setSelectedId(rowData.data.id);
                    }}
                  >
                    <i className={`${PrimeIcons.COG}`}></i>
                  </span>
                );
              }}
            />
          </TreeTable>
        </>
      )}
    </div>
  );
};

export default CategoriesTable;
