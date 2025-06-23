"use client";
import { useQuery } from "@tanstack/react-query";
import useUserDataStore from "../@utils/store/userDataStore";
import { getDepartmentCategoriesByDeptId } from "../@utils/services/departmentService";
import { Column } from "primereact/column";
import { TreeTable, TreeTableFilterMeta } from "primereact/treetable";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { useEffect, useState } from "react";
import CategorySettingsDialog from "./CategorySettingsDialog";
import useRefetchCategoriesStore from "../@utils/store/refetchDepartmentCategories";
import { Category } from "../types/types";
import { TreeNode } from "primereact/treenode";

const convertToTreeNodes = (categories: Category[]): TreeNode[] => {
  return categories.map((category) => ({
    key: String(category.id),
    data: {
      id: category.id,
      name: category.name,
      SLA: category.SLA,
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
  const { setRefetch } = useRefetchCategoriesStore();

  const [filters] = useState<TreeTableFilterMeta>({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    SLA: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [`department-categories-${user?.deptId}`],
    queryFn: () =>
      getDepartmentCategoriesByDeptId(user?.deptId, { limit: 100 }),
    enabled: !!user,
  });

  useEffect(() => {
    if (data?.data.categories) {
      setRefetch(refetch);
    }
  }, [data, refetch, setRefetch]);

  useEffect(() => {
    if (selectedId && selectedId > 0) setVisible(true);
    else setVisible(false);
  }, [selectedId]);

  useEffect(() => {
    if (!visible) setSelectedId(undefined);
  }, [visible]);

  if (isLoading) return <small className="mx-4">Loading categories...</small>;
  if (isError) {
    console.error(error);
    return <small className="mx-4">Error loading categories.</small>;
  }

  return (
    <div className="px-4 pb-8">
      <CategorySettingsDialog
        refetch={refetch}
        categoryId={selectedId}
        visible={visible}
        setVisible={setVisible}
      />

      <TreeTable
        value={convertToTreeNodes(data?.data.categories || [])}
        paginator
        rows={5}
        filters={filters}
        pt={{
          root: { className: "text-sm" },
          headerRow: { className: "bg-[#EEEEEE] text-sm" },
          column: {
            headerCell: { className: "py-2 px-3" },
            bodyCell: { className: "py-2 px-3" },
            filterInput: { className: "text-xs h-7 px-2" },
          },
          paginator: {
            root: { className: "bg-[#EEEEEE] rounded-b text-sm" },
          },
        }}
      >
        <Column
          field="name"
          header="Category Name"
          expander
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        />
        <Column
          field="SLA"
          header="SLA"
          filter
          filterPlaceholder="Exact SLA"
          style={{ minWidth: "8rem" }}
        />
        <Column
          header="Action"
          style={{ minWidth: "6rem" }}
          body={(rowData) => (
            <span
              onClick={() => setSelectedId(rowData.data.id)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-pointer hover:bg-gray-100"
              title="Edit Category"
            >
              <i className={`${PrimeIcons.COG} text-blue-600`}></i>
            </span>
          )}
        />
      </TreeTable>
    </div>
  );
};

export default CategoriesTable;
