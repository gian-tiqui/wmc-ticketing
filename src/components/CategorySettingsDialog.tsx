import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  deleteCategoryById,
  findCategoryById,
  updateCategoryByID,
} from "../@utils/services/categoryService";
import { Category } from "../types/types";
import useUserDataStore from "../@utils/store/userDataStore";
import { getDepartmentCategoriesByDeptId } from "../@utils/services/departmentService";
import { PrimeIcons } from "primereact/api";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { AxiosResponse } from "axios";
import handleErrors from "../@utils/functions/handleErrors";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import { confirmDialog } from "primereact/confirmdialog";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  categoryId: number | undefined;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Category>, Error>>;
}

interface FormFields {
  id: number;
  name: string;
  parentId: number | undefined;
  SLA: number;
}

const CategorySettingsDialog: React.FC<Props> = ({
  setVisible,
  visible,
  categoryId,
  refetch,
}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`category-${categoryId}`],
    queryFn: () => findCategoryById(categoryId),
    enabled: !!categoryId && categoryId > 0,
  });
  const toastRef = useRef<Toast>(null);
  const {
    setValue,
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormFields>();
  const { user } = useUserDataStore();
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const {
    data: departmentCategoriesData,
    refetch: refetchDepartmentCategoriesData,
  } = useQuery({
    queryKey: [`department-${user?.deptId}-categories`],
    queryFn: () =>
      getDepartmentCategoriesByDeptId(user?.deptId, { limit: 100 }),
    enabled: !!user && user !== undefined,
  });

  // Custom scrollbar theme
  const scrollbarTheme =
    "scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400";

  useEffect(() => {
    if (!visible) {
      reset();
      setSelectedCategory(undefined);
    }
  }, [visible, reset]);

  const onUpdate = (data: FormFields) => {
    updateCategoryByID(categoryId, {
      name: data.name,
      parentId: data.parentId,
      SLA: data.SLA,
    })
      .then((response) => {
        if (response.status === 200) {
          refetch();
          setVisible(false);
          reset();
          refetchDepartmentCategoriesData();
          setSelectedCategory(undefined);
        }
      })
      .catch((err) => {
        console.error(err);
        handleErrors(err, toastRef);
      });
  };

  const accept = () => {
    deleteCategoryById(categoryId)
      .then((response) => {
        if (response.status === 200) {
          refetch();
          refetchDepartmentCategoriesData();
          setVisible(false);
        }
      })
      .catch((err) => {
        handleErrors(err, toastRef);
      });
  };

  const onDelete = () => {
    confirmDialog({
      header: "Wait!",
      message: "Are you sure you want to delete this category?",
      accept,
    });
  };

  useEffect(() => {
    if (data) {
      setValue("id", data.data.category.id);
      setValue("name", data.data.category.name);
      setValue("parentId", data.data.category.parentId);
      setValue("SLA", data.data.category.SLA);
      setSelectedCategory(data.data.category.parentCategory);
    }
  }, [data, setValue]);

  const buildCategoryTree = (categories: Category[]): object[] => {
    return categories.map((category) => ({
      key: category.id.toString(),
      label: category.name,
      icon: PrimeIcons.TAG,
      value: category.id.toString(),
      children: category.subCategories
        ? buildCategoryTree(category.subCategories)
        : undefined,
    }));
  };

  if (isError) {
    console.error(error);
  }

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        header={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Category Settings
              </h3>
              <p className="text-sm text-slate-500">
                Manage category details and hierarchy
              </p>
            </div>
          </div>
        }
        visible={visible}
        className="w-[90vw] max-w-2xl max-h-[90vh] md:w-[70vw] lg:w-[50vw] xl:w-[40vw]"
        onHide={() => setVisible(false)}
        pt={{
          headerTitle: { className: "text-sm" },
          header: {
            className:
              "rounded-t-2xl bg-gradient-to-r from-white to-slate-50 border-b border-slate-200/50 p-6",
          },
          root: {
            className:
              "shadow-2xl shadow-slate-300/20 border border-slate-200/50 rounded-2xl overflow-hidden",
          },
          content: {
            className:
              "rounded-b-2xl bg-gradient-to-b from-white to-slate-50/30 p-6",
          },
          mask: {
            className: "backdrop-blur-sm bg-slate-900/10",
          },
        }}
      >
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              <span className="text-sm text-slate-600">
                Loading category data...
              </span>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 p-4 text-red-600 rounded-lg bg-red-50">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">
              There was a problem loading the data. Please try again later.
            </span>
          </div>
        )}

        {data?.data.category && (
          <form
            onSubmit={handleSubmit(onUpdate)}
            className={`space-y-6 overflow-auto max-h-[60vh] pr-2 ${scrollbarTheme}`}
          >
            {/* Category Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
                <h4 className="text-sm font-semibold text-slate-700">
                  Category Information
                </h4>
              </div>

              {/* Category Name */}
              <div className="space-y-2">
                <label
                  htmlFor="categoryNameInput"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Category Name
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <InputText
                    id="categoryNameInput"
                    className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter category name"
                    {...register("name", {
                      required: "Category name is required",
                    })}
                  />
                  {errors.name && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.081 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.name && (
                  <div className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 rounded-lg bg-red-50">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.name.message}
                  </div>
                )}
              </div>

              {/* SLA */}
              <div className="space-y-2">
                <label
                  htmlFor="slaInput"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Service Level Agreement (SLA)
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <InputText
                    id="slaInput"
                    type="number"
                    className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter SLA (in hours)"
                    {...register("SLA", {
                      required: "SLA is required",
                      min: {
                        value: 1,
                        message: "SLA must be at least 1 hour",
                      },
                    })}
                  />
                  {errors.SLA && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.081 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.SLA && (
                  <div className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 rounded-lg bg-red-50">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.SLA.message}
                  </div>
                )}
              </div>
            </div>

            {/* Category Hierarchy Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-green-500 to-teal-500"></div>
                <h4 className="text-sm font-semibold text-slate-700">
                  Category Hierarchy
                </h4>
              </div>

              {/* Parent Category */}
              <div className="space-y-2">
                <label
                  htmlFor="parentCategorySelect"
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5v4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 5v4"
                    />
                  </svg>
                  Parent Category
                  <span className="text-xs text-slate-500">(Optional)</span>
                </label>
                <TreeSelect
                  id="parentCategorySelect"
                  filter
                  className="w-full text-sm transition-all duration-200 shadow-sm bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  value={selectedCategory?.id.toString()}
                  options={buildCategoryTree(
                    departmentCategoriesData?.data.categories || []
                  )}
                  onChange={(e: TreeSelectChangeEvent) => {
                    if (!e.value) {
                      setSelectedCategory(undefined);
                      setValue("id", 0, { shouldValidate: true });
                      setValue("parentId", undefined);
                      return;
                    }

                    const findCategoryById = (
                      categories: Category[],
                      id: string
                    ): Category | undefined => {
                      for (const category of categories) {
                        if (category.id.toString() === id) return category;
                        if (category.subCategories) {
                          const found = findCategoryById(
                            category.subCategories,
                            id
                          );
                          if (found) return found;
                        }
                      }
                      return undefined;
                    };

                    const selectedCat = findCategoryById(
                      departmentCategoriesData?.data.categories || [],
                      e.value.toString()
                    );

                    if (selectedCat) {
                      setSelectedCategory(selectedCat);
                      setValue("id", selectedCat.id, { shouldValidate: true });
                      setValue("parentId", selectedCat.id);
                    }
                  }}
                  placeholder="Select a parent category"
                  disabled={
                    departmentCategoriesData?.data.categories.length === 0
                  }
                  pt={{
                    root: {
                      className: "h-11",
                    },
                  }}
                />
                <div className="flex items-center gap-1 px-3 py-2 text-xs rounded-lg text-slate-600 bg-slate-50">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Leave empty to make this a top-level category
                </div>
              </div>
            </div>

            <input type="hidden" {...register("parentId")} />

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200/50">
              <Button
                type="submit"
                className="flex items-center justify-center flex-1 h-12 gap-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Update Category
              </Button>
              <Button
                type="button"
                onClick={onDelete}
                className="flex items-center justify-center flex-1 h-12 gap-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Category
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
};

export default CategorySettingsDialog;
