import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useEffect,
} from "react";
import { useForm } from "react-hook-form";
import { createCategory } from "../@utils/services/categoryService";
import { Category } from "../types/types";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import useUserDataStore from "../@utils/store/userDataStore";
import { getDepartmentCategoriesByDeptId } from "../@utils/services/departmentService";
import { useQuery } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import CustomToast from "./CustomToast";
import handleErrors from "../@utils/functions/handleErrors";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Category>, Error>>;
}

interface FormFields {
  name: string;
  parentId?: number;
  SLA: number;
}

const CreateCategoryDialog: React.FC<Props> = ({
  visible,
  setVisible,
  refetch,
}) => {
  const toastRef = useRef<Toast>(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormFields>();
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const { user } = useUserDataStore();

  const { data: departmentCategoriesData } = useQuery({
    queryKey: [`department-${user?.deptId}-categories`],
    queryFn: () =>
      getDepartmentCategoriesByDeptId(user?.deptId, { limit: 100 }),
    enabled: !!user,
  });

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

  const onSubmit = (formData: FormFields) => {
    createCategory({
      name: formData.name,
      parentId: formData.parentId,
      SLA: formData.SLA,
      deptId: user?.deptId,
    })
      .then((res) => {
        if (res.status === 201) {
          if (refetch) refetch();
          setVisible(false);
          reset();
          setSelectedCategory(undefined);
        }
      })
      .catch((err) => handleErrors(err, toastRef));
  };

  useEffect(() => {
    if (!visible) {
      reset();
      setSelectedCategory(undefined);
    }
  }, [visible, reset]);

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        header={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Create New Category
              </h3>
              <p className="text-sm text-slate-500">
                Add a new category to organize your department's items
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`space-y-6 overflow-auto max-h-[60vh] pr-2 ${scrollbarTheme}`}
        >
          {/* Category Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-green-500 to-blue-500"></div>
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
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
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
                  const id = e.value;
                  const findCategory = (
                    cats: Category[],
                    id: string
                  ): Category | undefined => {
                    for (const c of cats) {
                      if (c.id.toString() === id) return c;
                      if (c.subCategories) {
                        const found = findCategory(c.subCategories, id);
                        if (found) return found;
                      }
                    }
                    return undefined;
                  };

                  if (id) {
                    const found = findCategory(
                      departmentCategoriesData?.data.categories || [],
                      id.toString()
                    );
                    if (found) {
                      setSelectedCategory(found);
                      setValue("parentId", found.id);
                    }
                  } else {
                    setSelectedCategory(undefined);
                    setValue("parentId", undefined);
                  }
                }}
                placeholder="Select a parent category"
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
                Leave empty to create a top-level category
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200/50">
            <Button
              type="submit"
              className="flex items-center justify-center w-full h-12 gap-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Category
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default CreateCategoryDialog;
