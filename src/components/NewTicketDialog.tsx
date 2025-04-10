import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import DialogTemplate from "./DialogTemplate";
import {
  Category,
  CreateTicket,
  Department,
  PriorityLevel,
  Query,
} from "../types/types";
import { useQuery } from "@tanstack/react-query";
import {
  getDepartmentCategoriesByDeptId,
  getDepartments,
} from "../@utils/services/departmentService";
import { Dropdown } from "primereact/dropdown";
import { getPriorityLevels } from "../@utils/services/priorityLevelService";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
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
      priorityLevelId: undefined,
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
      setSelectedPriorityLevel(undefined);
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
  const [selectedPriorityLevel, setSelectedPriorityLevel] = useState<
    PriorityLevel | undefined
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

  const { data: priorityLevelsData } = useQuery({
    queryKey: [`priority-levels-${JSON.stringify(query)}`],
    queryFn: () => getPriorityLevels(query),
  });

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
        setSelectedPriorityLevel(undefined);
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
    register("priorityLevelId", { required: "Priority level is required" });
  }, [register, visible]);

  return (
    <>
      <CustomToast ref={toastRef} />

      <DialogTemplate visible={visible} setVisible={setVisible} header={header}>
        <form onSubmit={handleSubmit(handleCreateTicket)}>
          {/* Department Dropdown */}
          <div className="w-full h-24">
            <label
              htmlFor="departmentsDropdown"
              className="text-sm text-blue-400"
            >
              To department
            </label>
            <Dropdown
              id="departmentsDropdown"
              pt={{
                header: { className: "bg-slate-800" },
                filterInput: { className: "bg-inherit text-slate-100" },
                list: { className: "bg-slate-800" },
                item: {
                  className:
                    "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
                },
                input: { className: "text-slate-100" },
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
              className={`w-full bg-inherit border-slate-400 ${
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

          {/* Category Dropdown */}

          <div className="w-full h-24">
            <label
              htmlFor="categoriesDropdown"
              className="text-sm text-blue-400"
            >
              Category
            </label>
            <Dropdown
              id="categoriesDropdown"
              pt={{
                header: { className: "bg-slate-800" },
                filterInput: { className: "bg-inherit text-slate-100" },
                list: { className: "bg-slate-800" },
                item: {
                  className:
                    "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
                },
                input: { className: "text-slate-100" },
              }}
              options={departmentCategoriesData?.data.categories}
              value={selectedCategory}
              optionLabel="name"
              onChange={(e) => {
                setSelectedCategory(e.value);
                setValue("categoryId", e.value?.id, { shouldValidate: true });
              }}
              filter
              disabled={
                selectedDepartment &&
                departmentCategoriesData?.data.categories.length === 0
              }
              className={`w-full bg-inherit border-slate-400 ${
                errors.categoryId ? "p-invalid" : ""
              }`}
              placeholder="Select a category"
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

          {/* Priority Level Dropdown */}

          <div className="w-full h-24">
            <label
              htmlFor="priorityLevelDropdown"
              className="text-sm text-blue-400"
            >
              Priority Level
            </label>
            <Dropdown
              id="priorityLevelDropdown"
              pt={{
                header: { className: "bg-slate-800" },
                filterInput: { className: "bg-inherit text-slate-100" },
                list: { className: "bg-slate-800" },
                item: {
                  className:
                    "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
                },
                input: { className: "text-slate-100" },
              }}
              options={priorityLevelsData?.data.priorityLevels}
              value={selectedPriorityLevel}
              optionLabel="name"
              onChange={(e) => {
                setSelectedPriorityLevel(e.value);
                setValue("priorityLevelId", e.value?.id, {
                  shouldValidate: true,
                });
              }}
              className={`w-full bg-inherit border-slate-400 ${
                errors.priorityLevelId ? "p-invalid" : ""
              }`}
              placeholder="Select a priority level"
            />
            {errors.priorityLevelId && (
              <div className="flex items-center gap-2 text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">
                  {errors.priorityLevelId.message}
                </small>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="h-24">
            <label htmlFor="titleInput" className="text-sm text-blue-400">
              Title
            </label>
            <IconField id="titleInput" iconPosition="left">
              <InputIcon className="pi pi-search"> </InputIcon>
              <InputText
                {...register("title", { required: "Title is required." })}
                placeholder="Search"
                className={`bg-inherit w-full text-slate-100 ${
                  errors.title ? "p-invalid" : ""
                }`}
              />
            </IconField>
            {errors.title && (
              <div className="flex items-center gap-2 text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">{errors.title.message}</small>
              </div>
            )}
          </div>

          {/* Description Textarea (No Validation) */}
          <label htmlFor="descriptionInput" className="text-sm text-blue-400">
            Description
          </label>
          <InputTextarea
            {...register("description", { required: false })}
            id="descriptionInput"
            className="w-full mb-3 bg-inherit h-52 text-slate-100"
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
            <p className="text-sm hover:underline">Require service report</p>
          </div>

          <Button
            className="justify-center w-full gap-2"
            icon={`${PrimeIcons.PLUS_CIRCLE}`}
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
