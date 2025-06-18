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
  parentId: number | null;
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
    enabled: !!categoryId && categoryId !== undefined && categoryId > 0,
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

  const { data: departmentCategoriesData } = useQuery({
    queryKey: [`department-${user?.deptId}-categories`],
    queryFn: () =>
      getDepartmentCategoriesByDeptId(user?.deptId, { limit: 100 }),
    enabled: !!user && user !== undefined,
  });

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
        header={`Category Settings`}
        className="p-4 w-96 md:w-[500px]"
        pt={{
          root: { className: "shadow-none" },
          header: {
            className: "bg-[#EEEEEE] rounded-t-3xl",
          },
          content: {
            className:
              "bg-[#EEEEEE] pt-5 rounded-b-3xl scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400",
          },
          mask: { className: "backdrop-blur" },

          closeButton: { className: "bg-white" },
        }}
        visible={visible}
        onHide={() => {
          if (visible) setVisible(false);
        }}
      >
        {isLoading && <span className="text-sm">Category data loading...</span>}
        {isError && (
          <span className="text-sm">
            There was a problem in loading the data. Try again later.
          </span>
        )}
        {data?.data.category && (
          <form
            onSubmit={handleSubmit(onUpdate)}
            className="flex flex-col gap-4"
          >
            {/* Name Input Field */}
            <div>
              <label htmlFor="name" className="block mb-1 text-xs font-medium">
                Category Name
              </label>
              <InputText
                id="name"
                {...register("name", { required: "Category name is required" })}
                className={`w-full border border-black text-sm font-medium p-2 rounded ${
                  errors.name ? "p-invalid" : ""
                }`}
                placeholder="Enter category name"
              />
              {errors.name && (
                <div className="flex items-center gap-2 mt-1 text-red-500">
                  <i className={PrimeIcons.EXCLAMATION_CIRCLE}></i>
                  <small>{errors.name.message}</small>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block mb-1 text-xs font-medium">
                Category SLA
              </label>
              <InputText
                id="name"
                type="number"
                {...register("SLA", { required: "Category SLA is required" })}
                className={`w-full border border-black text-sm font-medium p-2 rounded ${
                  errors.name ? "p-invalid" : ""
                }`}
                placeholder="Enter category SLA"
              />
              {errors.name && (
                <div className="flex items-center gap-2 mt-1 text-red-500">
                  <i className={PrimeIcons.EXCLAMATION_CIRCLE}></i>
                  <small>{errors.SLA?.message}</small>
                </div>
              )}
            </div>

            {/* Category Tree Select */}
            <div>
              <p className="text-xs font-medium">Parent Category</p>
              <TreeSelect
                id="categoriesTreeSelect"
                filter
                pt={{
                  root: { className: "bg-white border-black" },
                  tree: {
                    root: { className: "bg-[#EEEEEE]" },
                    content: { className: "bg-[#EEEEEE]" },
                  },
                  wrapper: { className: "bg-[#EEEEEE]" },
                  header: { className: "bg-[#EEEEEE]" },
                  filter: { className: "bg-inherit" },
                }}
                className={`w-full h-12 border border-black items-center text-sm font-medium bg-inherit ${
                  errors.id ? "p-invalid" : ""
                }`}
                options={buildCategoryTree(
                  departmentCategoriesData?.data.categories || []
                )}
                onChange={(e: TreeSelectChangeEvent) => {
                  if (!e.value) {
                    setSelectedCategory(undefined);
                    setValue("id", 0, { shouldValidate: true });
                    setValue("parentId", null);
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
                value={selectedCategory?.id.toString()}
                placeholder="Select a category"
                disabled={
                  departmentCategoriesData?.data.categories.length === 0
                }
              />
              {errors.id && (
                <div className="flex items-center gap-2 mt-1 text-red-500">
                  <i className={PrimeIcons.EXCLAMATION_CIRCLE}></i>
                  <small>{errors.id.message}</small>
                </div>
              )}
            </div>

            <input type="hidden" {...register("parentId")} />

            <div className="flex justify-between pt-4">
              <Button type="submit" label="Update" icon={PrimeIcons.CHECK} />
              <Button
                onClick={onDelete}
                type="button"
                label="Delete"
                icon={PrimeIcons.TRASH}
                severity="danger"
              />
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
};

export default CategorySettingsDialog;
