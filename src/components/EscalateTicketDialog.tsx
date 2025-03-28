import { Dispatch, SetStateAction, useState, useMemo } from "react";
import DialogTemplate from "./DialogTemplate";
import { Category, Department, Query, Ticket, User } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import {
  getDepartments,
  getDepartmentCategoriesByDeptId,
  getDepartmentUsersByDeptId,
} from "../@utils/services/departmentService";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { TicketStatus } from "../@utils/enums/enum";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setStatusId: Dispatch<SetStateAction<number>>;
  ticket: Ticket;
  selectedUser: User | undefined;
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
  selectedCategory: Category | undefined;
  setSelectedCategory: Dispatch<SetStateAction<Category | undefined>>;
  selectedDepartment: Department | undefined;
  setSelectedDepartment: Dispatch<SetStateAction<Department | undefined>>;
}

const EscalateTicketDialog: React.FC<Props> = ({
  visible,
  setVisible,
  selectedCategory,
  setSelectedCategory,
  selectedDepartment,
  setSelectedDepartment,
  selectedUser,
  setSelectedUser,
  setStatusId,
}) => {
  const [query] = useState<Query>({ search: "", limit: 10 });

  const { data: departmentsData } = useQuery({
    queryKey: [`departments-${JSON.stringify(query)}`],
    queryFn: () => getDepartments(query),
    enabled: visible,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: departmentUsers } = useQuery({
    queryKey: [`department-${selectedDepartment?.id}-user`],
    queryFn: () => getDepartmentUsersByDeptId(selectedDepartment?.id, query),
    enabled: !!selectedDepartment,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const memoizedCategories = useMemo(
    () => departmentCategoriesData?.data.categories || [],
    [departmentCategoriesData]
  );

  const memoizedUsers = useMemo(
    () => departmentUsers?.data.users || [],
    [departmentUsers]
  );

  const handleEscalate = () => {
    if (selectedDepartment && selectedCategory && selectedUser) {
      setStatusId(TicketStatus.ESCALATED);
      setVisible(false);
    }
  };

  // Reset selections when dialog closes
  const handleDialogClose = () => {
    setVisible(false);
    setSelectedDepartment(undefined);
    setSelectedCategory(undefined);
    setSelectedUser(undefined);
  };

  return (
    <DialogTemplate
      visible={visible}
      setVisible={handleDialogClose}
      header="Escalate Ticket"
    >
      <div>
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
              // Reset dependent selections
              setSelectedCategory(undefined);
              setSelectedUser(undefined);
            }}
            filter
            placeholder="Select a department"
            className={`w-full bg-inherit border-slate-400`}
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
            className={`w-full bg-inherit border-slate-400`}
            options={memoizedCategories}
            value={selectedCategory}
            optionLabel="name"
            onChange={(e) => {
              setSelectedCategory(e.value);
              setSelectedUser(undefined);
            }}
            filter
            disabled={!selectedDepartment || memoizedCategories.length === 0}
            placeholder="Select a category"
          />
        </div>

        <div className="w-full h-24">
          <label htmlFor="categoriesDropdown" className="text-sm text-blue-400">
            Assigned Personnel
          </label>
          <Dropdown
            id="assignUserDropdown"
            options={memoizedUsers}
            optionLabel="fullName"
            value={selectedUser}
            className={`w-full bg-inherit border-slate-400 mb-4`}
            onChange={(e) => setSelectedUser(e.value)}
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
            placeholder="Assign a person to this"
            disabled={!selectedDepartment || memoizedUsers.length === 0}
          />
        </div>

        <Button
          className="items-center justify-center w-full gap-2"
          icon={`${PrimeIcons.FORWARD}`}
          onClick={handleEscalate}
          disabled={!selectedDepartment || !selectedCategory || !selectedUser}
        >
          Escalate
        </Button>
      </div>
    </DialogTemplate>
  );
};

export default EscalateTicketDialog;
