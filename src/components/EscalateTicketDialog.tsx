import { Dispatch, SetStateAction, useState, useMemo } from "react";
import {
  Category,
  Department,
  Query,
  Ticket,
  User,
  UserData,
} from "../types/types";
import { useQuery } from "@tanstack/react-query";
import {
  getDepartments,
  getDepartmentCategoriesByDeptId,
  getDepartmentUsersByDeptId,
} from "../@utils/services/departmentService";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Dialog } from "primereact/dialog";

interface EscalationData {
  assignedUserId: number;
  categoryId: number;
  deptId: number;
}

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  ticket: Ticket;
  selectedUser: (User & { fullName: string }) | undefined;
  setSelectedUser: Dispatch<
    SetStateAction<(User & { fullName: string }) | undefined>
  >;
  selectedCategory: Category | undefined;
  setSelectedCategory: Dispatch<SetStateAction<Category | undefined>>;
  selectedDepartment: Department | undefined;
  setSelectedDepartment: Dispatch<SetStateAction<Department | undefined>>;
  onEscalate: (data: EscalationData) => void;
  isLoading?: boolean;
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
  ticket,
  onEscalate,
  isLoading = false,
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

  const memoizedDepartments = useMemo(
    () => departmentsData?.data?.departments || [],
    [departmentsData]
  );

  const memoizedCategories = useMemo(
    () => departmentCategoriesData?.data?.categories || [],
    [departmentCategoriesData]
  );

  const memoizedUsers = useMemo(() => {
    const users = departmentUsers?.data?.users || [];
    return users.map((user: UserData) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    }));
  }, [departmentUsers]);

  const handleEscalate = () => {
    if (selectedDepartment && selectedCategory && selectedUser) {
      onEscalate({
        assignedUserId: selectedUser.id,
        categoryId: selectedCategory.id,
        deptId: selectedDepartment.id,
      });
    }
  };

  // Reset selections when dialog closes
  const handleDialogClose = () => {
    if (isLoading) return; // Prevent closing while loading
    setVisible(false);
    // Don't reset selections here - let parent component handle it
  };

  const isFormValid = selectedDepartment && selectedCategory && selectedUser;

  return (
    <Dialog
      visible={visible}
      onHide={handleDialogClose}
      closable={!isLoading}
      closeOnEscape={!isLoading}
      className="w-[95vw] max-w-2xl"
      pt={{
        root: {
          className: "backdrop-blur-xl bg-black/20",
        },
        header: {
          className:
            "bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50 rounded-t-2xl p-6 shadow-sm",
        },
        content: {
          className:
            "bg-gradient-to-b from-white to-slate-50/30 rounded-b-2xl p-0 overflow-auto",
        },
        closeButton: {
          className: `w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border-0 transition-all duration-200 shadow-sm hover:shadow-md ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`,
        },
        mask: {
          className: "backdrop-blur-sm bg-black/10",
        },
      }}
      header={
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
            <i className={`${PrimeIcons.ARROW_UP} text-white text-lg`}></i>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Escalate Ticket #{ticket.id}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Transfer to specialized department
            </p>
          </div>
          {isLoading && (
            <div className="ml-auto">
              <div className="flex items-center gap-2 text-orange-600">
                <div className="w-4 h-4 border-2 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
                <span className="text-sm font-medium">Processing...</span>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className={`p-6 space-y-6 ${isLoading ? "opacity-50" : ""}`}>
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedDepartment ? "bg-blue-500" : "bg-slate-300"
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedCategory ? "bg-blue-500" : "bg-slate-300"
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedUser ? "bg-blue-500" : "bg-slate-300"
            }`}
          ></div>
          <div className="flex-1 h-px ml-2 bg-slate-200"></div>
          <span className="text-xs font-medium text-slate-500">
            {selectedUser
              ? "3/3 Complete"
              : selectedCategory
              ? "2/3"
              : selectedDepartment
              ? "1/3"
              : "0/3"}
          </span>
        </div>

        {/* Current Assignment Info */}
        {ticket.assignedUser && (
          <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <i className={`${PrimeIcons.INFO_CIRCLE} text-blue-500`}></i>
              <span className="font-medium">Current Assignment</span>
            </div>
            <p className="mt-1 text-xs text-blue-600">
              Currently assigned to{" "}
              <span className="font-medium">
                {ticket.assignedUser.firstName} {ticket.assignedUser.lastName}
              </span>{" "}
              in {ticket.department?.name || "Unknown Department"}
            </p>
          </div>
        )}

        {/* Department Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
              <i className={`${PrimeIcons.BUILDING} text-blue-600 text-sm`}></i>
            </div>
            <div>
              <label
                htmlFor="departmentsDropdown"
                className="text-sm font-medium text-slate-700"
              >
                Destination Department
              </label>
              <p className="text-xs text-slate-500">
                Choose the department to handle this ticket
              </p>
            </div>
          </div>

          <div className="relative">
            <Dropdown
              id="departmentsDropdown"
              pt={{
                root: {
                  className:
                    "w-full border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-200",
                },
                input: {
                  className:
                    "text-sm font-medium text-slate-700 p-4 bg-transparent placeholder:text-slate-400",
                },
                trigger: {
                  className: "text-slate-500 mr-3",
                },
                panel: {
                  className:
                    "border-2 border-slate-200 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm mt-2",
                },
                header: {
                  className:
                    "bg-gradient-to-r from-slate-50 to-white p-3 border-b border-slate-200/50",
                },
                filterInput: {
                  className:
                    "w-full p-2 border border-slate-200 rounded-lg bg-white/80 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                },
                list: {
                  className: "bg-transparent p-2",
                },
                item: {
                  className:
                    "p-3 rounded-lg hover:bg-blue-50 focus:bg-blue-50 transition-all duration-150 text-slate-700 font-medium",
                },
              }}
              options={memoizedDepartments}
              value={selectedDepartment}
              optionLabel="name"
              onChange={(e) => {
                setSelectedDepartment(e.value);
                setSelectedCategory(undefined);
                setSelectedUser(undefined);
              }}
              filter
              placeholder="Select a department"
              className="w-full h-14"
              disabled={isLoading}
            />
            {selectedDepartment && (
              <div className="absolute transform -translate-y-1/2 top-1/2 right-12">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                selectedDepartment
                  ? "bg-gradient-to-br from-purple-100 to-purple-200"
                  : "bg-slate-100"
              }`}
            >
              <i
                className={`${PrimeIcons.TAGS} text-sm ${
                  selectedDepartment ? "text-purple-600" : "text-slate-400"
                }`}
              ></i>
            </div>
            <div>
              <label
                htmlFor="categoriesDropdown"
                className={`text-sm font-medium transition-colors duration-300 ${
                  selectedDepartment ? "text-slate-700" : "text-slate-400"
                }`}
              >
                Category
              </label>
              <p
                className={`text-xs transition-colors duration-300 ${
                  selectedDepartment ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Specify the type of issue or request
              </p>
            </div>
          </div>

          <div className="relative">
            <Dropdown
              id="categoriesDropdown"
              pt={{
                root: {
                  className: `w-full border-2 rounded-xl transition-all duration-200 ${
                    !selectedDepartment || memoizedCategories.length === 0
                      ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                      : "border-slate-200 bg-white/80 backdrop-blur-sm hover:border-purple-300 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10"
                  }`,
                },
                input: {
                  className: `text-sm font-medium p-4 bg-transparent placeholder:text-slate-400 ${
                    !selectedDepartment || memoizedCategories.length === 0
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-slate-700"
                  }`,
                },
                trigger: {
                  className: `mr-3 ${
                    !selectedDepartment || memoizedCategories.length === 0
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`,
                },
                panel: {
                  className:
                    "border-2 border-slate-200 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm mt-2",
                },
                header: {
                  className:
                    "bg-gradient-to-r from-slate-50 to-white p-3 border-b border-slate-200/50",
                },
                filterInput: {
                  className:
                    "w-full p-2 border border-slate-200 rounded-lg bg-white/80 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
                },
                list: {
                  className: "bg-transparent p-2",
                },
                item: {
                  className:
                    "p-3 rounded-lg hover:bg-purple-50 focus:bg-purple-50 transition-all duration-150 text-slate-700 font-medium",
                },
              }}
              className="w-full h-14"
              options={memoizedCategories}
              value={selectedCategory}
              optionLabel="name"
              onChange={(e) => {
                setSelectedCategory(e.value);
                setSelectedUser(undefined);
              }}
              filter
              disabled={
                !selectedDepartment ||
                memoizedCategories.length === 0 ||
                isLoading
              }
              placeholder={
                !selectedDepartment
                  ? "Select department first"
                  : "Select a category"
              }
            />
            {selectedCategory && (
              <div className="absolute transform -translate-y-1/2 top-1/2 right-12">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* User Assignment */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                selectedCategory
                  ? "bg-gradient-to-br from-emerald-100 to-emerald-200"
                  : "bg-slate-100"
              }`}
            >
              <i
                className={`${PrimeIcons.USER} text-sm ${
                  selectedCategory ? "text-emerald-600" : "text-slate-400"
                }`}
              ></i>
            </div>
            <div>
              <label
                htmlFor="assignUserDropdown"
                className={`text-sm font-medium transition-colors duration-300 ${
                  selectedCategory ? "text-slate-700" : "text-slate-400"
                }`}
              >
                Assigned Personnel
              </label>
              <p
                className={`text-xs transition-colors duration-300 ${
                  selectedCategory ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Choose who will handle this escalated ticket
              </p>
            </div>
          </div>

          <div className="relative">
            <Dropdown
              id="assignUserDropdown"
              options={memoizedUsers}
              optionLabel="fullName"
              value={selectedUser}
              className="w-full h-14"
              onChange={(e) => setSelectedUser(e.value)}
              pt={{
                root: {
                  className: `w-full border-2 rounded-xl transition-all duration-200 ${
                    !selectedDepartment || memoizedUsers.length === 0
                      ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                      : "border-slate-200 bg-white/80 backdrop-blur-sm hover:border-emerald-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10"
                  }`,
                },
                input: {
                  className: `text-sm font-medium p-4 bg-transparent placeholder:text-slate-400 ${
                    !selectedDepartment || memoizedUsers.length === 0
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-slate-700"
                  }`,
                },
                trigger: {
                  className: `mr-3 ${
                    !selectedDepartment || memoizedUsers.length === 0
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`,
                },
                panel: {
                  className:
                    "border-2 border-slate-200 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm mt-2",
                },
                header: {
                  className:
                    "bg-gradient-to-r from-slate-50 to-white p-3 border-b border-slate-200/50",
                },
                filterInput: {
                  className:
                    "w-full p-2 border border-slate-200 rounded-lg bg-white/80 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
                },
                list: {
                  className: "bg-transparent p-2",
                },
                item: {
                  className:
                    "p-3 rounded-lg hover:bg-emerald-50 focus:bg-emerald-50 transition-all duration-150 text-slate-700 font-medium",
                },
              }}
              placeholder={
                !selectedDepartment
                  ? "Complete previous steps first"
                  : "Assign to personnel"
              }
              disabled={
                !selectedDepartment || memoizedUsers.length === 0 || isLoading
              }
            />
            {selectedUser && (
              <div className="absolute transform -translate-y-1/2 top-1/2 right-12">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200/50">
          <Button
            className={`w-full h-12 rounded-xl gap-2 font-medium transition-all duration-200 ${
              !isFormValid || isLoading
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
            icon={isLoading ? undefined : `${PrimeIcons.ARROW_UP}`}
            iconPos="right"
            onClick={handleEscalate}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
          >
            {isLoading
              ? "Escalating..."
              : !isFormValid
              ? "Complete all fields to escalate"
              : "Escalate Ticket"}
          </Button>

          {isFormValid && !isLoading && (
            <div className="p-3 mt-3 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <i className={`${PrimeIcons.CHECK_CIRCLE} text-green-500`}></i>
                <span className="font-medium">Ready to escalate</span>
              </div>
              <p className="mt-1 text-xs text-green-600">
                Ticket will be transferred to{" "}
                <span className="font-medium">{selectedUser.fullName}</span> in{" "}
                {selectedDepartment.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default EscalateTicketDialog;
