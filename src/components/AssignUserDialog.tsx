import React, { Dispatch, SetStateAction, useState } from "react";
import DialogTemplate from "./DialogTemplate";
import { Query, Ticket, User } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getDepartmentUsersByDeptId } from "../@utils/services/departmentService";
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
}

const AssignUserDialog: React.FC<Props> = ({
  visible,
  setVisible,
  setStatusId,
  ticket,
  selectedUser,
  setSelectedUser,
}) => {
  const [query] = useState<Query>({ search: "", limit: 10 });

  const { data: departmentUsers } = useQuery({
    queryKey: [`department-${ticket.deptId}-user`],
    queryFn: () => getDepartmentUsersByDeptId(ticket.deptId, query),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleConfirm = () => {
    if (selectedUser) {
      setStatusId(TicketStatus.ASSIGNED);
      setVisible(false);
    }
  };

  return (
    <DialogTemplate
      visible={visible}
      setVisible={setVisible}
      header="Assign User"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirm();
        }}
      >
        <label className="text-sm" htmlFor="assignUserDropdown">
          Assigned Personnel
        </label>
        <Dropdown
          id="assignUserDropdown"
          options={departmentUsers?.data.users}
          optionLabel="fullName"
          value={selectedUser}
          className={`w-full bg-inherit border-black bg-white mb-4 h-12`}
          onChange={(e) => setSelectedUser(e.value)}
          pt={{
            header: { className: "bg-white " },
            filterInput: { className: "bg-inherit " },
            list: { className: "bg-white" },
            item: {
              className: "focus:bg-[#EEEEEE] ",
            },
            input: { className: "text-sm" },
          }}
          placeholder="Assign a person to this"
        />

        <Button
          type="submit"
          icon={PrimeIcons.CHECK_CIRCLE}
          className="items-center justify-center w-full gap-2 bg-blue-600"
          disabled={!selectedUser}
        >
          Confirm
        </Button>
      </form>
    </DialogTemplate>
  );
};

export default AssignUserDialog;
