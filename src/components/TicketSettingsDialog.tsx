import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { Ticket } from "../types/types";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  ticket: Ticket;
}

const TicketSettingsDialog: React.FC<Props> = ({
  setVisible,
  visible,
  ticket,
}) => {
  return (
    <Dialog
      pt={{
        header: {
          className:
            "bg-slate-900 text-slate-100 border-t border-x border-slate-700",
        },
        content: {
          className:
            "bg-slate-900 text-slate-100 pt-5 border-x border-b border-slate-700",
        },
        mask: { className: "backdrop-blur" },
      }}
      className="h-96 w-96"
      header={
        <div>
          <p>{ticket.title}</p>
        </div>
      }
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
    ></Dialog>
  );
};

export default TicketSettingsDialog;
