import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useUserDataStore from "../@utils/store/userDataStore";
import { getDepartmentCategoriesByDeptId } from "../@utils/services/departmentService";
import { Column } from "primereact/column";
import { TreeTable, TreeTableFilterMeta } from "primereact/treetable";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import CategorySettingsDialog from "./CategorySettingsDialog";
import useRefetchCategoriesStore from "../@utils/store/refetchDepartmentCategories";
import { Category } from "../types/types";
import { TreeNode } from "primereact/treenode";
import CreateCategoryDialog from "./CreateCategoryDialog";

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
        placeholder="Search categories..."
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

const AddCategoryButton = React.memo(({ onClick }: { onClick: () => void }) => (
  <Button
    icon={PrimeIcons.PLUS}
    className="w-10 h-10 p-0 text-white transition-all duration-200 border rounded-lg bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm"
    onClick={onClick}
    tooltip="Add Category"
    tooltipOptions={{ position: "bottom" }}
  />
));

interface Props {
  isExpanded?: boolean;
}

const CategoriesTable: React.FC<Props> = ({ isExpanded = true }) => {
  const { user } = useUserDataStore();
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const { setRefetch } = useRefetchCategoriesStore();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState<TreeTableFilterMeta>({});
  const [addCategoryVisible, setAddCategoryVisible] = useState<boolean>(false);
  const { refetch: refetchCategories } = useRefetchCategoriesStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`department-categories-${user?.deptId}`],
    queryFn: () =>
      getDepartmentCategoriesByDeptId(user?.deptId, { limit: 100 }),
    enabled: !!user,
  });

  const initFilters = useCallback(() => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      SLA: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  }, []);

  useEffect(() => {
    initFilters();
  }, [initFilters]);

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
    (rowData: TreeNode) => (
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
          <span className="text-xs font-semibold text-white">
            {rowData.data.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{rowData.data.name}</div>
          <div className="text-xs text-gray-500">Category</div>
        </div>
      </div>
    ),
    []
  );

  const slaBodyTemplate = useCallback(
    (rowData: TreeNode) => (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {rowData.data.SLA}
      </span>
    ),
    []
  );

  const actionBodyTemplate = useCallback(
    (rowData: TreeNode) => (
      <div className="flex items-center gap-2">
        <Button
          icon={PrimeIcons.COG}
          className="w-8 h-8 p-0 text-gray-600 transition-all duration-200 bg-gray-100 border-0 rounded-lg hover:bg-gray-200 hover:text-gray-800"
          onClick={() => setSelectedId(rowData.data.id)}
          tooltip="Edit Category"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    ),
    []
  );

  const handleAddCategory = useCallback(() => {
    setAddCategoryVisible(true);
  }, []);

  const scrollbarTheme =
    "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100";

  const categoriesTableContent = (
    <div className="animate-fadeIn">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block w-8 h-8 mb-3 border-b-2 border-green-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-600">
              Loading categories...
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
              Failed to load categories
            </p>
            <p className="mt-1 text-xs text-gray-500">Please try again later</p>
          </div>
        </div>
      ) : (
        <TreeTable
          value={convertToTreeNodes(data?.data.categories || [])}
          paginator
          rows={10}
          filters={filters}
          emptyMessage={
            <div className="py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                <i className={`${PrimeIcons.SITEMAP} text-gray-400 text-2xl`} />
              </div>
              <p className="font-medium text-gray-600">No categories found</p>
              <p className="mt-1 text-sm text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          }
          loading={isLoading}
          className="text-sm"
          pt={{
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
            field="name"
            header="Category Name"
            expander
            filterPlaceholder="Search by name"
            body={nameBodyTemplate}
            pt={{
              filterInput: {
                className:
                  "text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200",
              },
            }}
            style={{ width: "auto", minWidth: "20rem" }}
          />
          <Column
            field="SLA"
            header="SLA"
            filterPlaceholder="Exact SLA"
            body={slaBodyTemplate}
            pt={{
              filterInput: {
                className:
                  "text-xs py-2 px-3 border border-slate-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200",
              },
            }}
            style={{ width: "120px", minWidth: "120px" }}
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
            style={{ width: "100px", minWidth: "100px" }}
          />
        </TreeTable>
      )}
    </div>
  );

  const tabs = [
    {
      header: `All Categories (${data?.data.categories?.length || 0})`,
      body: categoriesTableContent,
    },
  ];

  return (
    <div className="w-full h-full bg-[#EEE]">
      <CreateCategoryDialog
        visible={addCategoryVisible}
        setVisible={setAddCategoryVisible}
        refetch={refetchCategories}
      />
      {/* Header Section */}
      <div className="relative p-6 mb-8 overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                <i className={`${PrimeIcons.SITEMAP} text-white text-xl`} />
              </div>
              <div>
                <h1
                  className={`text-2xl font-bold text-white ${
                    !isExpanded && "ms-14"
                  }`}
                >
                  Categories Management
                </h1>
                <p className="mt-1 text-sm text-green-100">
                  Organize and manage your department categories
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
              <AddCategoryButton onClick={handleAddCategory} />
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
                    "px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-100/80 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg",
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

      {/* Dialog */}
      <CategorySettingsDialog
        refetch={refetch}
        categoryId={selectedId}
        visible={visible}
        setVisible={setVisible}
      />
    </div>
  );
};

export default CategoriesTable;
