import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { TicketStatus } from "../@utils/enums/enum";

interface Props {
  setPauseReason: Dispatch<SetStateAction<string>>;
  setStatusId: Dispatch<SetStateAction<number>>;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface FormFields {
  pauseReason: string;
}

const PauseReason: React.FC<Props> = ({
  setPauseReason,
  setStatusId,
  visible,
  setVisible,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const handleCloseTicket = (data: FormFields) => {
    setPauseReason(data.pauseReason);
    setStatusId(TicketStatus.ON_HOLD);
  };

  return (
    <Dialog
      header="Pause Ticket"
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
      pt={{
        header: {
          className:
            "bg-blue-500 text-slate-100 border-t border-x border-slate-700",
        },
        content: {
          className:
            "bg-slate-900 text-slate-100 pt-5 border-x border-slate-700 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400",
        },
        closeButton: { className: "bg-white" },
      }}
      className="w-96"
    >
      <form onSubmit={handleSubmit(handleCloseTicket)}>
        <h4 className="mb-1 text-slate-100">
          Enter your reason here to pause the ticket.
        </h4>
        <InputTextarea
          {...register("pauseReason", { required: true })}
          className="w-full h-52 bg-slate-800 text-slate-100"
        />
        <span className="text-sm text-red-400">
          {errors.pauseReason?.message && "This field is required"}
        </span>
        <Button
          className="justify-center w-full h-12 gap-2 mt-2"
          icon={`${PrimeIcons.PAUSE}`}
          type="submit"
        >
          Pause Ticket
        </Button>
      </form>
    </Dialog>
  );
};

export default PauseReason;
