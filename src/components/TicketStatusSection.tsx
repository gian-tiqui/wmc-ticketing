import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { Ticket } from "../types/types";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import { Divider } from "primereact/divider";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Timeline } from "primereact/timeline";

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
  const [status, setStatus] = useState<number>(1);
  const { register } = useForm<FormFields>({
    defaultValues: { statusId: ticket.statusId },
  });

  return (
    <form className="mb-6">
      <CustomToast ref={toastRef} />
      <h4 className="text-lg font-medium">Status</h4>
      <Divider />
      update me and change me into timeline with clickable markers
      <div className="flex items-center">
        <div className="w-32">
          <span className="text-md">Current:</span>{" "}
          <span className="font-medium">{ticket.status.type}</span>
        </div>
        <div className="flex items-center justify-center w-full gap-2">
          <Button
            disabled={status !== 1}
            onClick={() => setStatus(2)}
            type="button"
          >
            Acknowledge
          </Button>
          <Button
            disabled={status !== 2 && status !== 3}
            onClick={() => setStatus(3)}
            type="button"
          >
            Assign
          </Button>
          <Button
            disabled={status !== 3}
            onClick={() => setStatus(4)}
            type="button"
          >
            Resolve
          </Button>
          <Button
            disabled={status !== 4}
            onClick={() => setStatus(5)}
            type="button"
          >
            Close
          </Button>
          <Button
            disabled={status !== 5}
            onClick={() => setStatus(6)}
            type="button"
          >
            Re-open
          </Button>
          <Button
            disabled={status !== 6 && status !== 5}
            onClick={() => setStatus(1)}
            type="button"
          >
            Close-Resolve
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TicketStatusSection;
