import React, {
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Query, Ticket, User } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getDepartmentUsersByDeptId } from "../@utils/services/departmentService";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Dialog } from "primereact/dialog";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  selectedUser: (User & { fullName: string }) | undefined;
  setSelectedUser: Dispatch<
    SetStateAction<(User & { fullName: string }) | undefined>
  >;
  ticket: Ticket;
  onAssign: (user: User & { fullName: string }) => void;
  isLoading?: boolean;
}

const AssignUserDialog: React.FC<Props> = ({
  visible,
  setVisible,
  ticket,
  selectedUser,
  setSelectedUser,
  onAssign,
  isLoading = false,
}) => {
  const [query] = useState<Query>({ search: "", limit: 10 });

  const { data: departmentUsers, error } = useQuery({
    queryKey: [`department-${ticket.deptId}-user`],
    queryFn: () => getDepartmentUsersByDeptId(ticket.deptId, query),
    enabled: visible,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const memoizedUsers = useMemo(
    () => departmentUsers?.data.users || [],
    [departmentUsers]
  );

  // Handle confirm with better validation
  const handleConfirm = useCallback(() => {
    if (selectedUser && !isLoading) {
      onAssign(selectedUser);
    }
  }, [selectedUser, isLoading, onAssign]);

  // Reset selections when dialog closes
  const handleDialogClose = useCallback(() => {
    if (!isLoading) {
      setVisible(false);
      setSelectedUser(undefined);
    }
  }, [setVisible, setSelectedUser, isLoading]);

  // Handle user selection
  const handleUserChange = useCallback(
    (e: any) => {
      if (!isLoading) {
        setSelectedUser(e.value);
      }
    },
    [setSelectedUser, isLoading]
  );

  const hasError = error && visible;
  const hasUsers = memoizedUsers.length > 0;
  const canAssign = selectedUser && !isLoading && hasUsers;

  return (
    <Dialog
      visible={visible}
      onHide={handleDialogClose}
      className="w-[95vw] max-w-xl"
      closable={!isLoading}
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
          <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
            <i className={`${PrimeIcons.USER_PLUS} text-white text-lg`}></i>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">
              Assign User
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Assign this ticket to a team member
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <span className="text-sm font-medium">Assigning...</span>
            </div>
          )}
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedUser ? "bg-blue-500" : "bg-slate-300"
            }`}
          ></div>
          <div className="flex-1 h-px ml-2 bg-slate-200"></div>
          <span className="text-xs font-medium text-slate-500">
            {selectedUser ? "1/1 Complete" : "0/1"}
          </span>
        </div>

        {/* Error State */}
        {hasError && (
          <div className="p-3 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <i
                className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-500`}
              ></i>
              <span className="font-medium">Unable to load users</span>
            </div>
            <p className="mt-1 text-xs text-red-600">
              Please check your connection and try again.
            </p>
          </div>
        )}

        {/* User Assignment */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
              <i className={`${PrimeIcons.USER} text-blue-600 text-sm`}></i>
            </div>
            <div>
              <label
                htmlFor="assignUserDropdown"
                className="text-sm font-medium text-slate-700"
              >
                Assigned Personnel
              </label>
              <p className="text-xs text-slate-500">
                Choose who will handle this ticket
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
              onChange={handleUserChange}
              loading={isLoading}
              pt={{
                root: {
                  className: `w-full border-2 rounded-xl transition-all duration-200 ${
                    !hasUsers || isLoading
                      ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-75"
                      : "border-slate-200 bg-white/80 backdrop-blur-sm hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
                  }`,
                },
                input: {
                  className: `text-sm font-medium p-4 bg-transparent placeholder:text-slate-400 ${
                    !hasUsers || isLoading
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-slate-700"
                  }`,
                },
                trigger: {
                  className: `mr-3 ${
                    !hasUsers || isLoading ? "text-slate-400" : "text-slate-500"
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
              placeholder={
                isLoading
                  ? "Loading users..."
                  : !hasUsers
                  ? "No users available"
                  : "Select a team member"
              }
              disabled={!hasUsers || isLoading}
              filter={hasUsers && !isLoading}
            />
            {selectedUser && !isLoading && (
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
              !canAssign
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
            icon={isLoading ? undefined : PrimeIcons.USER_PLUS}
            iconPos="right"
            onClick={handleConfirm}
            disabled={!canAssign}
            loading={isLoading}
          >
            {isLoading
              ? "Assigning..."
              : !selectedUser
              ? "Select a user to assign"
              : "Assign Ticket"}
          </Button>

          {selectedUser && !isLoading && (
            <div className="p-3 mt-3 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <i className={`${PrimeIcons.CHECK_CIRCLE} text-blue-500`}></i>
                <span className="font-medium">Ready to assign</span>
              </div>
              <p className="mt-1 text-xs text-blue-600">
                Ticket will be assigned to{" "}
                <span className="font-medium">{selectedUser.fullName}</span>
              </p>
            </div>
          )}

          {isLoading && (
            <div className="p-3 mt-3 border border-yellow-200 rounded-lg bg-yellow-50">
              <div className="flex items-center gap-2 text-sm text-yellow-700">
                <div className="w-3 h-3 border-2 border-yellow-600 rounded-full border-t-transparent animate-spin"></div>
                <span className="font-medium">Processing assignment...</span>
              </div>
              <p className="mt-1 text-xs text-yellow-600">
                Please wait while we update the ticket status.
              </p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default AssignUserDialog;
