import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import DialogTemplate from "../components/DialogTemplate";
import { Category, Department, PriorityLevel, Query } from "../types/types";
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

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  header?: ReactNode;
}

interface FormFields {
  deptId: number;
  categoryId: number;
  priorityLevelId: number;
  title: string;
  description: string;
  statusId: number;
}

const NewTicketDialog: React.FC<Props> = ({ visible, setVisible, header }) => {
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<FormFields>();
  const [query] = useState<Query>({ search: "", offset: 0, limit: 50 });
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [selectedCategory, setSelectedCateogry] = useState<
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

  const handleCreateTicket = (data: FormFields) => {
    console.log(data);
  };

  return (
    <DialogTemplate visible={visible} setVisible={setVisible} header={header}>
      <form onSubmit={handleSubmit(handleCreateTicket)}>
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
            }}
            filter
            placeholder="Select a department"
            className="w-full bg-inherit border-slate-400"
          />
        </div>

        <div className="w-full h-24">
          <label htmlFor="categoriesDropdown" className="text-sm text-blue-400">
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
              setSelectedCateogry(e.value);
            }}
            filter
            disabled={
              selectedDepartment &&
              departmentCategoriesData?.data.categories.length === 0
            }
            className="w-full bg-inherit border-slate-400"
            placeholder="Select a category"
          />
        </div>

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
            }}
            className="w-full bg-inherit border-slate-400"
            placeholder="Select a priority level"
          />
        </div>

        <div className="h-24">
          <label htmlFor="titleInput" className="text-sm text-blue-400">
            Title
          </label>
          <IconField id="titleInput" iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText placeholder="Search" className="bg-inherit" />
          </IconField>
        </div>

        <label htmlFor="descriptionInput" className="text-sm text-blue-400">
          Description
        </label>
        <InputTextarea
          id="descriptionInput"
          className="w-full mb-3 bg-inherit"
          placeholder="Enter your description"
        />
        <Button
          className="justify-center w-full gap-2"
          icon={`${PrimeIcons.PLUS_CIRCLE}`}
        >
          Create Ticket
        </Button>
      </form>
    </DialogTemplate>
  );
};

export default NewTicketDialog;
