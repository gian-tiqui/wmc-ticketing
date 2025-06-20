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
import CustomToast from "./CustomToast";
import handleErrors from "../@utils/functions/handleErrors";
import DialogTemplate from "./DialogTemplate";

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
      <DialogTemplate
        visible={visible}
        setVisible={setVisible}
        header="Create Category"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium">Category Name</label>
            <InputText
              {...register("name", { required: "Category name is required" })}
              className="w-full p-2 text-sm font-medium border border-black rounded"
              placeholder="Enter category name"
            />
            {errors.name && (
              <div className="mt-1 text-sm text-red-500">
                <i className={PrimeIcons.EXCLAMATION_CIRCLE} />{" "}
                {errors.name.message}
              </div>
            )}
          </div>

          {/* SLA */}
          <div>
            <label className="text-xs font-medium">SLA</label>
            <InputText
              type="number"
              {...register("SLA", { required: "SLA is required" })}
              className="w-full p-2 text-sm font-medium border border-black rounded"
              placeholder="Enter SLA"
            />
            {errors.SLA && (
              <div className="mt-1 text-sm text-red-500">
                <i className={PrimeIcons.EXCLAMATION_CIRCLE} />{" "}
                {errors.SLA.message}
              </div>
            )}
          </div>

          {/* Parent Category */}
          <div>
            <p className="text-xs font-medium">Parent Category</p>
            <TreeSelect
              filter
              className="w-full h-12 text-sm font-medium border border-black"
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
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" label="Create" icon={PrimeIcons.PLUS} />
          </div>
        </form>
      </DialogTemplate>
    </>
  );
};

export default CreateCategoryDialog;
