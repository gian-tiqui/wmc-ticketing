import React, { useEffect, useRef, useState } from "react";
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
} from "../types/types";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Timeline } from "primereact/timeline";
import { PrimeIcons } from "primereact/api";

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
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const TicketStatusSection: React.FC<Props> = ({ ticket, refetch }) => {
  const toastRef = useRef<Toast>(null);

  const [statusId, setStatusId] = useState<number>(ticket.status.id);
  const [selectedUser, setSelectedUser] = useState<
    User & { fullName: string }
  >();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const [closingReason, setClosingReason] = useState<string>();
  const [resolution, setResolution] = useState<string>("");
  const [pauseReason, setPauseReason] = useState<string>("");
  const [resolutionTime, setResolutionTime] = useState<Nullable<Date>>();
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const [assignUserVisible, setAssignUserVisible] = useState(false);
  const [escalateUserVisible, setEscalateUserVisible] = useState(false);
  const [closeDialogVisible, setCloseDialogVisible] = useState(false);
  const [serviceReportDialogVisible, setServiceReportDialogVisible] =
    useState(false);
  const [pauseReasonDialogVisible, setPauseReasonDialogVisible] =
    useState(false);

  useEffect(() => {
    if (statusId > 0 && statusId <= 9 && statusId !== ticket.status.id) {
      setIsUpdating(true);
      updateTicketById(ticket.id, {
        statusId,
        assignedUserId: selectedUser?.id,
        categoryId: selectedCategory?.id,
        deptId: selectedDepartment?.id,
        closingReason,
        resolution,
        resolutionTime: resolutionTime
          ? new Date(resolutionTime).toISOString()
          : new Date().toISOString(),
        pauseReason,
      })
        .then((response) => {
          if (response.status === 200) {
            if (files?.length > 0) {
              const formData = new FormData();
              files.forEach((f) => formData.append("files", f.file));
              uploadServiceReport(ticket.id, formData).then((res) => {
                if (res.status === 201) refetch();
              });
            }

            refetch();
            setClosingReason("");
            setResolution("");
            setFiles([]);
            setAssignUserVisible(false);
            setEscalateUserVisible(false);
            setCloseDialogVisible(false);
            setServiceReportDialogVisible(false);
          }
        })
        .catch(() => {
          toastRef.current?.show({
            severity: "error",
            summary: "Update Failed",
            detail: "Failed to update ticket status",
            life: 3000,
          });
          setStatusId(ticket.status.id);
        })
        .finally(() => setIsUpdating(false));
    }
  }, [statusId]);

  const handleStatusChange = (newStatusId: number) => setStatusId(newStatusId);

  const markers: StatusMarker[] = [
    {
      name: "Acknowledge",
      disabled: statusId !== TicketStatus.NEW || isUpdating,
      onClick: () => handleStatusChange(TicketStatus.ACKNOWLEDGED),
      type: "",
      loading: false,
    },
    {
      name: "Assign",
      disabled: statusId !== TicketStatus.ACKNOWLEDGED || isUpdating,
      onClick: () => setAssignUserVisible(true),
      type: "",
      loading: false,
    },
    {
      name: "Escalate",
      disabled:
        ![TicketStatus.ASSIGNED, TicketStatus.ESCALATED].includes(statusId) ||
        isUpdating,
      onClick: () => setEscalateUserVisible(true),
      type: "",
      loading: false,
    },
    {
      name: "Resolve",
      disabled:
        ![
          TicketStatus.ASSIGNED,
          TicketStatus.ESCALATED,
          TicketStatus.ON_HOLD,
        ].includes(statusId) || isUpdating,
      onClick: () => setServiceReportDialogVisible(true),
      type: "",
      loading: false,
    },
    {
      name: "Close",
      disabled: isUpdating || statusId === TicketStatus.CLOSED,
      onClick: () => setCloseDialogVisible(true),
      type: "",
      loading: false,
    },
    {
      name: "Open",
      disabled:
        ![TicketStatus.CLOSED, TicketStatus.RESOLVED].includes(statusId) ||
        isUpdating,
      onClick: () => handleStatusChange(TicketStatus.NEW),
      type: "",
      loading: false,
    },
  ];

  const customizedMarker = (item: StatusMarker) => {
    const isActive = item.name === ticket.status.type;
    return (
      <button
        type="button"
        className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
          item.disabled
            ? "bg-gray-300 text-white cursor-not-allowed"
            : isActive
            ? "bg-amber-500 text-white shadow-md"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        disabled={item.disabled}
        onClick={item.onClick}
        title={item.name}
      >
        {item.name[0]}
      </button>
    );
  };

  const customizedContent = (item: StatusMarker) => (
    <div className="text-xs font-medium text-center sm:text-sm">
      <span className="hidden sm:inline">{item.name}</span>
      <span className="sm:hidden">{item.name.slice(0, 3)}</span>
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
        </div>
        <p className="text-xs text-gray-600 sm:text-sm">
          Manage the lifecycle of the current ticket.
        </p>
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
          {/* Mobile Timeline - Vertical on small screens */}
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
                    }`}
                    disabled={marker.disabled}
                    onClick={marker.onClick}
                    title={marker.name}
                  >
                    {marker.name[0]}
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {marker.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Timeline - Horizontal on sm+ screens */}
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
              icon={PrimeIcons.PAUSE}
              disabled={
                ![
                  TicketStatus.ASSIGNED,
                  TicketStatus.ESCALATED,
                  TicketStatus.CLOSED,
                  TicketStatus.CLOSED_RESOLVED,
                ].includes(statusId) || isUpdating
              }
              className="px-3 py-2 text-xs text-white transition-all bg-blue-600 rounded-lg sm:px-4 sm:text-sm hover:bg-blue-700"
              pt={{
                root: {
                  className: "flex items-center gap-2",
                },
              }}
            >
              <span className="hidden sm:inline">Pause Ticket</span>
              <span className="sm:hidden">Pause</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignUserDialog
        visible={assignUserVisible}
        setVisible={setAssignUserVisible}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        ticket={ticket}
        setStatusId={setStatusId}
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
        setStatusId={setStatusId}
      />
      <CloseTicketDialog
        ticket={ticket}
        refetch={refetch}
        visible={closeDialogVisible}
        setVisible={setCloseDialogVisible}
        setStatusId={setStatusId}
        setClosingReason={setClosingReason}
      />
      <ResolutionDialog
        visible={serviceReportDialogVisible}
        setVisible={setServiceReportDialogVisible}
        refetch={refetch}
        setStatusId={setStatusId}
        files={files}
        setFiles={setFiles}
        resolutionTime={resolutionTime}
        setResolutionTime={setResolutionTime}
        setResolution={setResolution}
      />
      <PauseReason
        visible={pauseReasonDialogVisible}
        setVisible={setPauseReasonDialogVisible}
        setPauseReason={setPauseReason}
        setStatusId={setStatusId}
      />
    </div>
  );
};

export default TicketStatusSection;
