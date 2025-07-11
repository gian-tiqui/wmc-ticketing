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
        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200 ${
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
    <div className="text-xs font-medium text-center">{item.name}</div>
  );

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <CustomToast ref={toastRef} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-50">
            <i className={`${PrimeIcons.FILTER} text-blue-600 text-lg`}></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Ticket Status</h2>
        </div>
        <p className="text-sm text-gray-600">
          Manage the lifecycle of the current ticket.
        </p>
      </div>

      {/* Status Card */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-2">
            <i className={`${PrimeIcons.TICKET} text-gray-600`}></i>
            <h3 className="text-lg font-semibold text-gray-900">
              Status Tracker
            </h3>
          </div>
          <Chip
            className="font-medium text-white bg-blue-600"
            label={`Current: ${ticket.status.type}`}
          />
        </div>

        <div className="p-6 space-y-4">
          <Timeline
            value={markers}
            layout="horizontal"
            marker={customizedMarker}
            content={customizedContent}
            className="w-full"
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
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
              className="px-4 py-2 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Pause Ticket
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
