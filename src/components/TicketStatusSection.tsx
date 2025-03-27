import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { Category, Department, Ticket, User } from "../types/types";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import { Divider } from "primereact/divider";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { updateTicketById } from "../@utils/services/ticketService";
import { TicketStatus } from "../@utils/enums/enum";
import AssignUserDialog from "./AssignUserDialog";
import EscalateTicketDialog from "./EscalateTicketDialog";
import ServiceReportDialog from "./ServiceReportDialog";

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

interface FormFields {
  statusId: number;
}

const TicketStatusSection: React.FC<Props> = ({ ticket, refetch }) => {
  const toastRef = useRef<Toast>(null);
  const [statusId, setStatusId] = useState<number>(ticket.status.id);
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
  const { setValue } = useForm<FormFields>({
    defaultValues: { statusId: ticket.statusId },
  });

  useEffect(() => {
    if (statusId > 0 && statusId <= 7 && statusId !== ticket.status.id) {
      setIsUpdating(true);
      updateTicketById(ticket.id, {
        statusId,
        assignedUserId: selectedUser?.id,
        categoryId: selectedCategory?.id,
        deptId: selectedDepartment?.id,
      })
        .then((response) => {
          if (response.status === 200) {
            refetch();
            if (assignUserVisible) setAssignUserVisible(!assignUserVisible);
            if (escalateUserVisible)
              setEscalateUserVisible(!escalateUserVisible);
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
  }, [
    statusId,
    ticket.status.id,
    ticket.id,
    refetch,
    setValue,
    selectedUser,
    selectedCategory,
    selectedDepartment,
    assignUserVisible,
    escalateUserVisible,
  ]);

  const handleStatusChange = (newStatusId: number) => {
    setStatusId(newStatusId);
  };

  return (
    <form className="mb-6">
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
      <ServiceReportDialog
        visible={serviceReportDialogVisible}
        setVisible={setServiceReportDialogVisible}
      />
      <CustomToast ref={toastRef} />
      <h4 className="text-lg font-medium">Status</h4>
      <Divider />
      <div className="flex items-center">
        <div className="w-32">
          <span className="text-md">Current:</span>{" "}
          <span className="font-medium">{ticket.status.type}</span>
        </div>
        <div className="flex items-center justify-center w-full gap-2">
          <Button
            disabled={statusId !== TicketStatus.NEW || isUpdating}
            onClick={() => handleStatusChange(TicketStatus.ACKNOWLEDGED)}
            type="button"
            loading={isUpdating && statusId === TicketStatus.ASSIGNED}
          >
            Acknowledge
          </Button>
          {ticket.statusId === TicketStatus.ASSIGNED ||
          ticket.statusId === TicketStatus.ESCALATED ? (
            <Button
              disabled={
                (statusId !== TicketStatus.ACKNOWLEDGED &&
                  statusId !== TicketStatus.ASSIGNED &&
                  statusId !== TicketStatus.ESCALATED) ||
                isUpdating
              }
              onClick={() => setEscalateUserVisible(true)}
              type="button"
              loading={isUpdating && statusId === TicketStatus.ASSIGNED}
            >
              Escalate
            </Button>
          ) : (
            <Button
              disabled={
                (statusId !== TicketStatus.ACKNOWLEDGED &&
                  statusId !== TicketStatus.ACKNOWLEDGED) ||
                isUpdating
              }
              onClick={() => setAssignUserVisible(true)}
              type="button"
              loading={isUpdating && statusId === TicketStatus.ASSIGNED}
            >
              Assign
            </Button>
          )}

          <Button
            disabled={
              (statusId !== TicketStatus.ASSIGNED &&
                statusId !== TicketStatus.ESCALATED) ||
              isUpdating
            }
            onClick={() => handleStatusChange(TicketStatus.RESOLVED)}
            type="button"
            loading={isUpdating && statusId === TicketStatus.ESCALATED}
          >
            Resolve
          </Button>
          <Button
            disabled={statusId !== 5 || isUpdating}
            onClick={() => {
              if (ticket.reportRequired) {
                setServiceReportDialogVisible(true);
              } else {
                setStatusId(TicketStatus.CLOSED);
              }
            }}
            type="button"
            loading={isUpdating && statusId === TicketStatus.RESOLVED}
          >
            Close
          </Button>
          <Button
            disabled={statusId !== TicketStatus.CLOSED || isUpdating}
            onClick={() => handleStatusChange(TicketStatus.NEW)}
            type="button"
            loading={isUpdating && statusId === TicketStatus.NEW}
          >
            Re-open
          </Button>
          <Button
            disabled={statusId !== 6 || isUpdating}
            onClick={() => handleStatusChange(TicketStatus.NEW)}
            type="button"
            loading={isUpdating && statusId === TicketStatus.NEW}
          >
            Close-Resolve
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TicketStatusSection;
