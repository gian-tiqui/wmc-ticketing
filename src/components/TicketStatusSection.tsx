import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  Category,
  CustomFile,
  Department,
  StatusMarker,
  Ticket,
  User,
} from "../types/types";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import {
  updateTicketById,
  uploadServiceReport,
} from "../@utils/services/ticketService";
import { TicketStatus } from "../@utils/enums/enum";
import AssignUserDialog from "./AssignUserDialog";
import EscalateTicketDialog from "./EscalateTicketDialog";
import CloseTicketDialog from "./CloseTicketDialog";
import { Timeline } from "primereact/timeline";
import { Chip } from "primereact/chip";
import ResolutionDialog from "./ResolutionDialog";
import useUserDataStore from "../@utils/store/userDataStore";
import isUserInResolverDepartments from "../@utils/functions/isUserInResolverDepartments";
import { Nullable } from "primereact/ts-helpers";
import { PrimeIcons } from "primereact/api";
import PauseReason from "./PauseReason";

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const TicketStatusSection: React.FC<Props> = ({ ticket, refetch }) => {
  const toastRef = useRef<Toast>(null);
  const [statusId, setStatusId] = useState<number>(ticket.status.id);
  const [closingReason, setClosingReason] = useState<string | undefined>(
    ticket.closingReason
  );
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [escalateUserVisible, setEscalateUserVisible] =
    useState<boolean>(false);
  const [serviceReportDialogVisible, setServiceReportDialogVisible] =
    useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [assignUserVisible, setAssignUserVisible] = useState<boolean>(false);
  const [resolutionTime, setResolutionTime] = useState<Nullable<Date>>();
  const [closeDialogVisible, setCloseDialogVisible] = useState<boolean>(false);
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [resolution, setResolution] = useState<string>("");
  const [pauseReason, setPauseReason] = useState<string>("");
  const { user } = useUserDataStore();
  const [pauseReasonDialogVisible, setPauseReasonDialogVisible] =
    useState<boolean>(false);

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
            if (files && files.length > 0) {
              const formData = new FormData();
              files.forEach((file) => formData.append("files", file.file));

              uploadServiceReport(ticket.id, formData)
                .then((response) => {
                  if (response.status === 201) refetch();
                })
                .catch((error) => console.error(error));
            }
            setClosingReason("");
            setResolution("");
            setFiles([]);
            refetch();
            if (assignUserVisible) setAssignUserVisible(!assignUserVisible);
            if (escalateUserVisible)
              setEscalateUserVisible(!escalateUserVisible);
            if (closeDialogVisible) setCloseDialogVisible(false);
            if (serviceReportDialogVisible)
              setServiceReportDialogVisible(false);
          }
        })
        .catch((error) => {
          console.error("Update error:", error);
          toastRef.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update ticket status",
            life: 3000,
          });
          setStatusId(ticket.status.id);
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  }, [statusId]);

  const markers: StatusMarker[] = [
    {
      name: "Acknowledge",
      disabled: statusId !== TicketStatus.NEW || isUpdating,
      onClick: () => handleStatusChange(TicketStatus.ACKNOWLEDGED),
      type: "button",
      loading: isUpdating && statusId === TicketStatus.ASSIGNED,
    },
    {
      name:
        ticket.statusId === TicketStatus.ASSIGNED ||
        ticket.statusId === TicketStatus.ESCALATED
          ? "Escalate"
          : "Assign",

      disabled:
        (statusId !== TicketStatus.ACKNOWLEDGED &&
          statusId !== TicketStatus.ASSIGNED &&
          statusId !== TicketStatus.ESCALATED) ||
        isUpdating,
      onClick:
        ticket.statusId === TicketStatus.ASSIGNED ||
        ticket.statusId === TicketStatus.ESCALATED
          ? () => setEscalateUserVisible(true)
          : () => setAssignUserVisible(true),
      type: "button",
      loading: isUpdating && statusId === TicketStatus.ASSIGNED,
    },
    {
      name: "Resolve",
      disabled:
        (statusId !== TicketStatus.ASSIGNED &&
          statusId !== TicketStatus.ON_HOLD &&
          statusId !== TicketStatus.ESCALATED) ||
        isUpdating,
      onClick: () => {
        setServiceReportDialogVisible(true);
      },
      type: "button",
      loading: isUpdating && statusId === TicketStatus.ESCALATED,
    },
    {
      name: "Close",
      disabled: isUpdating || statusId === TicketStatus.CLOSED,
      type: "button",
      loading: isUpdating && statusId === TicketStatus.RESOLVED,
      onClick: () => {
        setCloseDialogVisible(true);
      },
    },
    {
      name: "Re-open",
      disabled:
        (statusId !== TicketStatus.CLOSED &&
          statusId !== TicketStatus.RESOLVED) ||
        isUpdating,
      onClick: () => handleStatusChange(TicketStatus.NEW),
      type: "button",
      loading: isUpdating && statusId === TicketStatus.NEW,
    },
    {
      name: "Finalize",
      disabled: statusId !== TicketStatus.RESOLVED || isUpdating,
      onClick: () => handleStatusChange(TicketStatus.CLOSED_RESOLVED),
      type: "button",
      loading: isUpdating && statusId === TicketStatus.CLOSED_RESOLVED,
    },
  ];

  const handleStatusChange = (newStatusId: number) => {
    setStatusId(newStatusId);
  };

  const customizedMarker = (marker: StatusMarker) => {
    return (
      <Button
        type={"button"}
        className="rounded-full"
        loading={marker.loading}
        disabled={marker.disabled}
        onClick={marker.onClick}
      >
        {marker.name[0]}
      </Button>
    );
  };

  const customizedContent = (marker: StatusMarker) => {
    return <div className="text-xs">{marker.name}</div>;
  };

  return (
    <>
      <form className="relative mb-16">
        {!isUserInResolverDepartments(user?.deptId) && (
          <div className="absolute z-10 w-full h-full"></div>
        )}
        <CloseTicketDialog
          setStatusId={setStatusId}
          setClosingReason={setClosingReason}
          refetch={refetch}
          setVisible={setCloseDialogVisible}
          visible={closeDialogVisible}
          ticket={ticket}
        />
        <AssignUserDialog
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          ticket={ticket}
          setStatusId={setStatusId}
          visible={assignUserVisible}
          setVisible={setAssignUserVisible}
        />
        <EscalateTicketDialog
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          ticket={ticket}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setStatusId={setStatusId}
          visible={escalateUserVisible}
          setVisible={setEscalateUserVisible}
        />
        <ResolutionDialog
          setStatusId={setStatusId}
          files={files}
          setFiles={setFiles}
          setResolution={setResolution}
          refetch={refetch}
          visible={serviceReportDialogVisible}
          setVisible={setServiceReportDialogVisible}
          setResolutionTime={setResolutionTime}
          resolutionTime={resolutionTime}
        />
        <PauseReason
          setPauseReason={setPauseReason}
          setStatusId={setStatusId}
          setVisible={setPauseReasonDialogVisible}
          visible={pauseReasonDialogVisible}
        />

        <CustomToast ref={toastRef} />
        <h4 className="text-lg font-medium">Status</h4>
        <Divider />
        <div className="">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="mb-2 text-md">Current:</span>{" "}
              <Chip
                className="font-medium text-white bg-blue-400"
                label={ticket.status.type}
              />
            </div>

            <Button
              onClick={() => setPauseReasonDialogVisible(true)}
              icon={`${PrimeIcons.PAUSE}`}
              className="gap-2"
              type="button"
              loading={isUpdating && statusId === TicketStatus.ON_HOLD}
              disabled={
                (statusId !== TicketStatus.ASSIGNED &&
                  statusId !== TicketStatus.CLOSED &&
                  statusId !== TicketStatus.ESCALATED &&
                  statusId !== TicketStatus.CLOSED_RESOLVED) ||
                isUpdating
              }
            >
              Pause Ticket
            </Button>
          </div>
          <div className="flex items-center justify-center w-full gap-2">
            <Timeline
              layout="horizontal"
              value={markers}
              marker={customizedMarker}
              content={customizedContent}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default TicketStatusSection;
