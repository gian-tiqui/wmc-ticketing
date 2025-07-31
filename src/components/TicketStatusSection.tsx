import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  updateTicketById,
  uploadServiceReport,
} from "../@utils/services/ticketService";
import {
  Category,
  CustomFile,
  Department,
  StatusMarker,
  Ticket,
  User,
  UserData,
} from "../types/types";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Timeline } from "primereact/timeline";
import { PrimeIcons } from "primereact/api";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";

import AssignUserDialog from "./AssignUserDialog";
import EscalateTicketDialog from "./EscalateTicketDialog";
import CloseTicketDialog from "./CloseTicketDialog";
import ResolutionDialog from "./ResolutionDialog";
import PauseReason from "./PauseReason";
import CustomToast from "./CustomToast";
import { TicketStatus } from "../@utils/enums/enum";
import { Nullable } from "primereact/ts-helpers";

interface Props {
  ticket: Ticket;
  currentUser: UserData | undefined; // Add current user prop to determine permissions
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

interface UpdateTicketData {
  statusId?: number;
  assignedUserId?: number;
  categoryId?: number;
  deptId?: number;
  closingReason?: string;
  resolution?: string;
  resolutionTime?: string;
  pauseReason?: string;
}

const TicketStatusSection: React.FC<Props> = ({
  ticket,
  currentUser,
  refetch,
}) => {
  const toastRef = useRef<Toast>(null);

  // State management
  const [currentStatusId, setCurrentStatusId] = useState<number>(
    ticket.status.id
  );
  const [selectedUser, setSelectedUser] = useState<
    User & { fullName: string }
  >();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const [, setClosingReason] = useState<string>("");
  const [resolution, setResolution] = useState<string>("");
  const [pauseReason, setPauseReason] = useState<string>("");
  const [resolutionTime, setResolutionTime] = useState<Nullable<Date>>();
  const [files, setFiles] = useState<CustomFile[]>([]);

  // Loading states for better UX
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingAction, setUpdatingAction] = useState<string>("");

  // Dialog visibility states
  const [assignUserVisible, setAssignUserVisible] = useState(false);
  const [escalateUserVisible, setEscalateUserVisible] = useState(false);
  const [closeDialogVisible, setCloseDialogVisible] = useState(false);
  const [serviceReportDialogVisible, setServiceReportDialogVisible] =
    useState(false);
  const [pauseReasonDialogVisible, setPauseReasonDialogVisible] =
    useState(false);

  // Permission helpers
  const isAssignedUser = currentUser?.sub === ticket.assignedUserId;
  const isIssuer = currentUser?.sub === ticket.issuerId;
  const isResolvedOrClosed = [
    TicketStatus.RESOLVED,
    TicketStatus.CLOSED,
  ].includes(currentStatusId);

  // Check if current user can perform actions based on role and ticket status
  const canPerformAction = useCallback(
    (actionType: "general" | "issuer-only" = "general"): boolean => {
      if (actionType === "issuer-only") {
        // Actions only issuers can perform
        if (!isIssuer) return false;
        // Issuers can only perform actions if ticket is resolved or closed
        return isResolvedOrClosed;
      }

      // General actions
      if (isAssignedUser && isResolvedOrClosed) {
        // Assigned users cannot perform actions if ticket is resolved or closed
        return false;
      }

      return true;
    },
    [isAssignedUser, isIssuer, isResolvedOrClosed]
  );

  // Update current status when ticket prop changes
  useEffect(() => {
    setCurrentStatusId(ticket.status.id);
  }, [ticket.status.id]);

  // Reset form data
  const resetFormData = useCallback(() => {
    setClosingReason("");
    setResolution("");
    setFiles([]);
    setPauseReason("");
    setSelectedUser(undefined);
    setSelectedCategory(undefined);
    setSelectedDepartment(undefined);
    setResolutionTime(null);
  }, []);

  // Close all dialogs
  const closeAllDialogs = useCallback(() => {
    setAssignUserVisible(false);
    setEscalateUserVisible(false);
    setCloseDialogVisible(false);
    setServiceReportDialogVisible(false);
    setPauseReasonDialogVisible(false);
  }, []);

  // Show success toast
  const showSuccessToast = useCallback((summary: string, detail: string) => {
    toastRef.current?.show({
      severity: "success",
      summary,
      detail,
      life: 4000,
    });
  }, []);

  // Show error toast
  const showErrorToast = useCallback((summary: string, detail: string) => {
    toastRef.current?.show({
      severity: "error",
      summary,
      detail,
      life: 5000,
    });
  }, []);

  // Upload service report files
  const handleFileUpload = useCallback(
    async (ticketId: number, files: CustomFile[]): Promise<boolean> => {
      if (!files?.length) return true;

      try {
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f.file));

        const response = await uploadServiceReport(ticketId, formData);
        return response.status === 201;
      } catch (error) {
        console.error("File upload error:", error);
        showErrorToast(
          "File Upload Failed",
          "Failed to upload service report files"
        );
        return false;
      }
    },
    [showErrorToast]
  );

  // Main update function with better error handling
  const updateTicketStatus = useCallback(
    async (
      statusId: number,
      additionalData: Partial<UpdateTicketData> = {},
      actionName: string = "update"
    ) => {
      if (isUpdating) return;

      setIsUpdating(true);
      setUpdatingAction(actionName);

      try {
        const updateData: UpdateTicketData = {
          statusId,
          ...additionalData,
        };

        // Add resolution time for resolved status
        if (statusId === TicketStatus.RESOLVED) {
          updateData.resolutionTime = resolutionTime
            ? new Date(resolutionTime).toISOString()
            : new Date().toISOString();
        }

        const response = await updateTicketById(ticket.id, updateData);

        if (response.status === 200) {
          // Handle file upload for resolution
          if (files?.length > 0) {
            const fileUploadSuccess = await handleFileUpload(ticket.id, files);
            if (!fileUploadSuccess) {
              // Even if file upload fails, the ticket update succeeded
              showErrorToast(
                "Partial Success",
                "Ticket updated but file upload failed. Please try uploading files again."
              );
            }
          }

          // Update local state
          setCurrentStatusId(statusId);

          // Reset form and close dialogs
          resetFormData();
          closeAllDialogs();

          // Refetch ticket data
          await refetch();

          // Show success message
          const statusName = getStatusName(statusId);
          showSuccessToast(
            "Status Updated",
            `Ticket ${statusName.toLowerCase()} successfully`
          );
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error: unknown) {
        console.error("Update ticket error:", error);

        // Revert status change
        setCurrentStatusId(ticket.status.id);

        // Show user-friendly error message
        let errorMessage = "An unexpected error occurred";
        if (typeof error === "object" && error !== null) {
          if (
            "response" in error &&
            typeof (error as { response?: unknown }).response === "object" &&
            (error as { response?: unknown }).response !== null
          ) {
            errorMessage =
              typeof (error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message === "string"
                ? (error as { response: { data: { message: string } } })
                    .response.data.message
                : typeof (error as { message?: string })?.message === "string"
                ? (error as unknown as { message: string }).message
                : errorMessage;
          } else if ("message" in error) {
            errorMessage =
              (error as { message?: string }).message || errorMessage;
          }
        }

        showErrorToast("Update Failed", errorMessage);
      } finally {
        setIsUpdating(false);
        setUpdatingAction("");
      }
    },
    [
      isUpdating,
      ticket.id,
      ticket.status.id,
      resolutionTime,
      files,
      refetch,
      resetFormData,
      closeAllDialogs,
      showSuccessToast,
      showErrorToast,
      handleFileUpload,
    ]
  );

  // Get status display name
  const getStatusName = (statusId: number): string => {
    const statusMap: Record<number, string> = {
      [TicketStatus.NEW]: "Opened",
      [TicketStatus.ACKNOWLEDGED]: "Acknowledged",
      [TicketStatus.ASSIGNED]: "Assigned",
      [TicketStatus.ESCALATED]: "Escalated",
      [TicketStatus.RESOLVED]: "Resolved",
      [TicketStatus.CLOSED]: "Closed",
      [TicketStatus.ON_HOLD]: "Paused",
    };
    return statusMap[statusId] || "Updated";
  };

  // Handle simple status changes with confirmation
  const handleSimpleStatusChange = useCallback(
    (statusId: number, actionName: string) => {
      const confirm = () => {
        updateTicketStatus(statusId, {}, actionName);
      };

      // Show confirmation for critical actions
      if ([TicketStatus.CLOSED, TicketStatus.NEW].includes(statusId)) {
        confirmDialog({
          message: `Are you sure you want to ${actionName.toLowerCase()} this ticket?`,
          header: `${actionName} Confirmation`,
          icon: "pi pi-exclamation-triangle",
          acceptClassName: "p-button-danger",
          accept: confirm,
          reject: () => {
            setCurrentStatusId(ticket.status.id);
          },
        });
      } else {
        confirm();
      }
    },
    [updateTicketStatus, ticket.status.id]
  );

  // Status markers configuration with role-based permissions
  const markers: StatusMarker[] = [
    {
      name: "Acknowledge",
      disabled:
        currentStatusId !== TicketStatus.NEW ||
        isUpdating ||
        !canPerformAction(),
      onClick: () =>
        handleSimpleStatusChange(TicketStatus.ACKNOWLEDGED, "Acknowledge"),
      type: "",
      loading: isUpdating && updatingAction === "Acknowledge",
    },
    {
      name: "Assign",
      disabled:
        currentStatusId !== TicketStatus.ACKNOWLEDGED ||
        isUpdating ||
        !canPerformAction(),
      onClick: () => setAssignUserVisible(true),
      type: "",
      loading: isUpdating && updatingAction === "Assign",
    },
    {
      name: "Escalate",
      disabled:
        ![TicketStatus.ASSIGNED, TicketStatus.ESCALATED].includes(
          currentStatusId
        ) ||
        isUpdating ||
        !canPerformAction(),
      onClick: () => setEscalateUserVisible(true),
      type: "",
      loading: isUpdating && updatingAction === "Escalate",
    },
    {
      name: "Resolve",
      disabled:
        ![
          TicketStatus.ASSIGNED,
          TicketStatus.ESCALATED,
          TicketStatus.ON_HOLD,
        ].includes(currentStatusId) ||
        isUpdating ||
        !canPerformAction(),
      onClick: () => setServiceReportDialogVisible(true),
      type: "",
      loading: isUpdating && updatingAction === "Resolve",
    },
    {
      name: "Close",
      disabled:
        isUpdating ||
        currentStatusId === TicketStatus.CLOSED ||
        !canPerformAction(),
      onClick: () => setCloseDialogVisible(true),
      type: "",
      loading: isUpdating && updatingAction === "Close",
    },
    {
      name: "Open",
      disabled:
        ![TicketStatus.CLOSED, TicketStatus.RESOLVED].includes(
          currentStatusId
        ) ||
        isUpdating ||
        !canPerformAction("issuer-only"), // Only issuer can reopen resolved/closed tickets
      onClick: () => handleSimpleStatusChange(TicketStatus.NEW, "Reopen"),
      type: "",
      loading: isUpdating && updatingAction === "Reopen",
    },
  ];

  // Custom marker with loading state
  const customizedMarker = (item: StatusMarker) => {
    const isActive = item.name === ticket.status.type;
    const isLoading = item.loading;

    return (
      <button
        type="button"
        className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
          item.disabled
            ? "bg-gray-300 text-white cursor-not-allowed"
            : isActive
            ? "bg-amber-500 text-white shadow-md"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } ${isLoading ? "opacity-75" : ""}`}
        disabled={item.disabled}
        onClick={item.onClick}
        title={`${item.name}${isLoading ? " (Processing...)" : ""}${
          item.disabled && !canPerformAction() ? " - Permission denied" : ""
        }`}
      >
        {isLoading ? (
          <ProgressSpinner
            style={{ width: "16px", height: "16px" }}
            strokeWidth="4"
            animationDuration="1s"
          />
        ) : (
          item.name[0]
        )}
      </button>
    );
  };

  const customizedContent = (item: StatusMarker) => (
    <div className="text-xs font-medium text-center sm:text-sm">
      <span className="hidden sm:inline">
        {item.name}
        {item.loading && (
          <span className="text-blue-600"> (Processing...)</span>
        )}
      </span>
      <span className="sm:hidden">
        {item.name.slice(0, 3)}
        {item.loading && "..."}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-4xl p-3 mx-auto sm:p-4 md:p-6">
      <CustomToast ref={toastRef} />

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50">
            <i
              className={`${PrimeIcons.FILTER} text-blue-600 text-base sm:text-lg`}
            ></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Ticket Status
          </h2>
          {isUpdating && (
            <div className="flex items-center gap-2 text-blue-600">
              <ProgressSpinner
                style={{ width: "20px", height: "20px" }}
                strokeWidth="4"
                animationDuration="1s"
              />
              <span className="text-sm font-medium">{updatingAction}...</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600 sm:text-sm">
          Manage the lifecycle of the current ticket.
        </p>

        {/* Permission info */}
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            Role:{" "}
            {isIssuer ? "Issuer" : isAssignedUser ? "Assigned User" : "Other"} |
            Status: {ticket.status.type}
            {isAssignedUser && isResolvedOrClosed && (
              <span className="ml-2 text-amber-600">
                ⚠ Limited actions (ticket resolved/closed)
              </span>
            )}
            {isIssuer && !isResolvedOrClosed && (
              <span className="ml-2 text-amber-600">
                ⚠ Reopen action only available for resolved/closed tickets
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Status Card */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
        <div className="flex flex-col items-start justify-between gap-3 px-3 py-3 border-b border-gray-200 sm:flex-row sm:items-center sm:px-4 md:px-6 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-2">
            <i
              className={`${PrimeIcons.TICKET} text-gray-600 text-sm sm:text-base`}
            ></i>
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
              Status Tracker
            </h3>
          </div>
          <Chip
            className="text-xs font-medium text-white bg-blue-600 sm:text-sm"
            label={`Current: ${ticket.status.type}`}
            pt={{
              root: {
                className: "px-2 py-1 sm:px-3 sm:py-1.5",
              },
            }}
          />
        </div>

        <div className="p-3 space-y-3 sm:p-4 md:p-6 sm:space-y-4">
          {/* Mobile Timeline */}
          <div className="block sm:hidden">
            <div className="space-y-3">
              {markers.map((marker, index) => (
                <div key={index} className="flex items-center gap-3">
                  <button
                    type="button"
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200 ${
                      marker.disabled
                        ? "bg-gray-300 text-white cursor-not-allowed"
                        : marker.name === ticket.status.type
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } ${marker.loading ? "opacity-75" : ""}`}
                    disabled={marker.disabled}
                    onClick={marker.onClick}
                    title={`${marker.name}${
                      marker.loading ? " (Processing...)" : ""
                    }${
                      marker.disabled && !canPerformAction()
                        ? " - Permission denied"
                        : ""
                    }`}
                  >
                    {marker.loading ? (
                      <ProgressSpinner
                        style={{ width: "16px", height: "16px" }}
                        strokeWidth="4"
                        animationDuration="1s"
                      />
                    ) : (
                      marker.name[0]
                    )}
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {marker.name}
                    {marker.loading && (
                      <span className="text-blue-600"> (Processing...)</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden sm:block">
            <Timeline
              value={markers}
              layout="horizontal"
              marker={customizedMarker}
              content={customizedContent}
              className="w-full"
              pt={{
                root: {
                  className: "w-full",
                },
                content: {
                  className: "text-xs sm:text-sm",
                },
              }}
            />
          </div>

          {/* Pause Button */}
          <div className="flex justify-end pt-3 border-t border-gray-100 sm:pt-4">
            <Button
              onClick={() => setPauseReasonDialogVisible(true)}
              icon={
                isUpdating && updatingAction === "Pause"
                  ? undefined
                  : PrimeIcons.PAUSE
              }
              disabled={
                ![
                  TicketStatus.ASSIGNED,
                  TicketStatus.ESCALATED,
                  TicketStatus.CLOSED,
                  TicketStatus.CLOSED_RESOLVED,
                ].includes(currentStatusId) ||
                isUpdating ||
                !canPerformAction()
              }
              loading={isUpdating && updatingAction === "Pause"}
              className="px-3 py-2 text-xs text-white transition-all bg-blue-600 rounded-lg sm:px-4 sm:text-sm hover:bg-blue-700 disabled:opacity-50"
              pt={{
                root: {
                  className: "flex items-center gap-2",
                },
              }}
            >
              <span className="hidden sm:inline">
                {isUpdating && updatingAction === "Pause"
                  ? "Pausing..."
                  : "Pause Ticket"}
              </span>
              <span className="sm:hidden">
                {isUpdating && updatingAction === "Pause"
                  ? "Pausing..."
                  : "Pause"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Modals with better props */}
      <AssignUserDialog
        visible={assignUserVisible}
        setVisible={setAssignUserVisible}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        ticket={ticket}
        onAssign={(user) => {
          updateTicketStatus(
            TicketStatus.ASSIGNED,
            { assignedUserId: user.id },
            "Assign"
          );
        }}
        isLoading={isUpdating && updatingAction === "Assign"}
      />

      <EscalateTicketDialog
        visible={escalateUserVisible}
        setVisible={setEscalateUserVisible}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        ticket={ticket}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onEscalate={(data) => {
          updateTicketStatus(TicketStatus.ESCALATED, data, "Escalate");
        }}
        isLoading={isUpdating && updatingAction === "Escalate"}
      />

      <CloseTicketDialog
        ticket={ticket}
        refetch={refetch}
        visible={closeDialogVisible}
        setVisible={setCloseDialogVisible}
        onClose={(reason) => {
          updateTicketStatus(
            TicketStatus.CLOSED,
            { closingReason: reason },
            "Close"
          );
        }}
        isLoading={isUpdating && updatingAction === "Close"}
      />

      <ResolutionDialog
        visible={serviceReportDialogVisible}
        setVisible={setServiceReportDialogVisible}
        files={files}
        setFiles={setFiles}
        resolutionTime={resolutionTime}
        setResolutionTime={setResolutionTime}
        resolution={resolution}
        setResolution={setResolution}
        onResolve={(data) => {
          updateTicketStatus(
            TicketStatus.RESOLVED,
            {
              resolution: data.resolution,
              resolutionTime: data.resolutionTime,
            },
            "Resolve"
          );
        }}
        isLoading={isUpdating && updatingAction === "Resolve"}
      />

      <PauseReason
        visible={pauseReasonDialogVisible}
        setVisible={setPauseReasonDialogVisible}
        pauseReason={pauseReason}
        setPauseReason={setPauseReason}
        onPause={(reason) => {
          updateTicketStatus(
            TicketStatus.ON_HOLD,
            { pauseReason: reason },
            "Pause"
          );
        }}
        isLoading={isUpdating && updatingAction === "Pause"}
      />
    </div>
  );
};

export default TicketStatusSection;
