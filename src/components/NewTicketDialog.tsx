import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import DialogTemplate from "./DialogTemplate";
import { Category, CreateTicket, Department, Query } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import {
  getDepartmentCategoriesByDeptId,
  getDepartments,
} from "../@utils/services/departmentService";
import { Dropdown } from "primereact/dropdown";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { createTicket } from "../@utils/services/ticketService";
import handleErrors from "../@utils/functions/handleErrors";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import { Checkbox } from "primereact/checkbox";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  header?: ReactNode;
  refetch: () => void;
}

const NewTicketDialog: React.FC<Props> = ({
  visible,
  setVisible,
  header,
  refetch,
}) => {
  const toastRef = useRef<Toast>(null);
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useForm<CreateTicket>({
    defaultValues: {
      deptId: undefined,
      categoryId: undefined,
      title: "",
      description: "",
      reportRequired: 0,
    },
  });

  useEffect(() => {
    if (!visible) {
      reset();
      setSelectedCategory(undefined);
      setSelectedDepartment(undefined);
    }
  }, [visible, reset]);

  const [query] = useState<Query>({ search: "", offset: 0, limit: 50 });
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const { data: departmentsData } = useQuery({
    queryKey: [`departments-${JSON.stringify(query)}`],
    queryFn: () => getDepartments(query),
    enabled: !!visible,
  });

  const { data: departmentCategoriesData } = useQuery({
    queryKey: [
      `department-${selectedDepartment?.id}-categories-${JSON.stringify(
        query
      )}`,
    ],
    queryFn: () =>
      getDepartmentCategoriesByDeptId(selectedDepartment?.id, query),
    enabled: !!selectedDepartment,
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

  const handleCreateTicket = (data: CreateTicket) => {
    createTicket(data)
      .then((response) => {
        if (response.status === 201) {
          toastRef.current?.show({
            severity: "success",
            detail: "Ticket Created Successfully.",
            summary: "Success",
          });
        }
        refetch();
        reset();
        setVisible(false);
        setSelectedCategory(undefined);
        setSelectedDepartment(undefined);
        setIsChecked(false);
      })
      .catch((error) => {
        handleErrors(error, toastRef);
      });
  };

  useEffect(() => {
    setValue("reportRequired", isChecked ? 1 : 0);
  }, [isChecked, setValue]);

  useEffect(() => {
    if (!visible) return;

    register("deptId", { required: "Department is required" });
    register("categoryId", { required: "Category is required" });
  }, [register, visible]);

  useEffect(() => {
    if (selectedDepartment) {
      setSelectedCategory(undefined);
      setValue("categoryId", undefined);
    }
  }, [selectedDepartment, setValue]);

  return (
    <>
      <CustomToast ref={toastRef} />

      <DialogTemplate visible={visible} setVisible={setVisible} header={header}>
        <form onSubmit={handleSubmit(handleCreateTicket)} noValidate>
          {/* Department Dropdown */}
          <div className="w-full h-24">
            <label htmlFor="departmentsDropdown" className="text-xs text-black">
              Department
            </label>
            <Dropdown
              id="departmentsDropdown"
              pt={{
                header: { className: "bg-[#EEEEEE]" },
                filterInput: { className: "bg-inherit " },
                list: { className: "bg-[#EEEEEE]" },
                item: {
                  className: " bg-inherit ",
                },
                input: { className: "text-sm" },
              }}
              options={departmentsData}
              value={selectedDepartment}
              optionLabel="name"
              onChange={(e) => {
                setSelectedDepartment(e.value);
                setValue("deptId", e.value?.id, { shouldValidate: true });
              }}
              filter
              placeholder="Select a department"
              className={`w-full bg-inherit border-black bg-white h-12 items-center ${
                errors.deptId ? "p-invalid" : ""
              }`}
            />
            {errors.deptId && (
              <div className="flex items-center gap-2 text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">{errors.deptId.message}</small>
              </div>
            )}
          </div>

          {/* Category TreeSelect */}
          <div className="w-full h-24">
            <label
              htmlFor="categoriesTreeSelect"
              className="text-xs text-black"
            >
              Category
            </label>
            <TreeSelect
              id="categoriesTreeSelect"
              filter
              pt={{
                root: {
                  className: "bg-white border-black",
                },
                tree: {
                  root: { className: "bg-[#EEEEEE]" },
                  content: {
                    className: "bg-[#EEEEEE]",
                  },
                },
                wrapper: { className: "bg-[#EEEEEE]" },
                header: {
                  className: "bg-[#EEEEEE]",
                },
                filter: {
                  className: "bg-inherit",
                },
              }}
              className={`w-full h-12 border border-black items-center bg-inherit ${
                errors.categoryId ? "p-invalid" : ""
              }`}
              options={buildCategoryTree(
                departmentCategoriesData?.data.categories || []
              )}
              onChange={(e: TreeSelectChangeEvent) => {
                if (!e.value) {
                  setSelectedCategory(undefined);
                  setValue("categoryId", undefined, { shouldValidate: true });
                  return;
                }

                const findCategoryById = (
                  categories: Category[],
                  id: string
                ): Category | undefined => {
                  for (const category of categories) {
                    if (category.id.toString() === id) {
                      return category;
                    }
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
                  setValue("categoryId", selectedCat.id, {
                    shouldValidate: true,
                  });
                }
              }}
              value={selectedCategory?.id.toString()}
              placeholder="Select a category"
              disabled={
                selectedDepartment &&
                departmentCategoriesData?.data.categories.length === 0
              }
            />
            {errors.categoryId && (
              <div className="flex items-center gap-2 text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">
                  {errors.categoryId.message}
                </small>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="h-24">
            <label htmlFor="titleInput" className="text-sm text-black">
              Title
            </label>

            <InputText
              {...register("title", { required: "Title is required." })}
              placeholder="Change Printer Drum"
              className={`bg-inherit w-full text-sm border-black bg-white ${
                errors.title ? "p-invalid" : ""
              }`}
            />
            {errors.title && (
              <div className="flex items-center gap-2 text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">{errors.title.message}</small>
              </div>
            )}
          </div>

          <label htmlFor="descriptionInput" className="text-sm text-black">
            Description
          </label>
          <InputTextarea
            {...register("description", { required: false })}
            id="descriptionInput"
            className="w-full mb-3 text-sm bg-white border-black bg-inherit h-52"
            placeholder="Enter your description"
          />

          <div
            onClick={() => setIsChecked(!isChecked)}
            className="flex items-center gap-2 mb-4 hover:cursor-pointer"
          >
            <Checkbox
              checked={isChecked}
              pt={{ box: { className: `${!isChecked && "bg-inherit"}` } }}
            />
            <p className="text-xs hover:underline">Require service report</p>
          </div>

          <Button
            className="justify-center w-full h-12 gap-2 text-sm font-bold bg-blue-600"
            type="submit"
          >
            Create Ticket
          </Button>
        </form>
      </DialogTemplate>
    </>
  );
};

export default NewTicketDialog;
