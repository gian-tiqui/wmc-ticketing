import React, { Dispatch, SetStateAction } from "react";
import DialogTemplate from "./DialogTemplate";
import { Ticket } from "../types/types";
import { useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { TicketStatus } from "../@utils/enums/enum";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  ticket: Ticket;
  setClosingReason: Dispatch<SetStateAction<string | undefined>>;
  setStatusId: Dispatch<SetStateAction<number>>;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

interface FormFields {
  closingReason: string;
}

const CloseTicketDialog: React.FC<Props> = ({
  visible,
  setVisible,
  setClosingReason,
  setStatusId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const handleCloseTicket = (data: FormFields) => {
    setClosingReason(data.closingReason);
    setStatusId(TicketStatus.CLOSED);
  };

  return (
    <DialogTemplate
      visible={visible}
      setVisible={setVisible}
      header="Close this Ticket?"
    >
      <form onSubmit={handleSubmit(handleCloseTicket)}>
        <h4 className="mb-1 ">
          Enter your closing reason here to close the ticket.
        </h4>
        <InputTextarea
          {...register("closingReason", { required: true })}
          className="w-full bg-white h-52"
        />
        <span className="text-sm text-red-400">
          {errors.closingReason?.message && "This field is required"}
        </span>
        <Button
          className="justify-center w-full h-12 gap-2 mt-2"
          icon={`${PrimeIcons.LOCK}`}
          type="submit"
        >
          Close Ticket
        </Button>
      </form>
    </DialogTemplate>
  );
};

export default CloseTicketDialog;
