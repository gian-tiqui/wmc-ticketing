import React, { useEffect, useState } from "react";
import { Ticket } from "../types/types";
import { PrimeIcons } from "primereact/api";
import UserDetails from "./UserDetails";
import { InputTextarea } from "primereact/inputtextarea";
import { TicketStatus } from "../@utils/enums/enum";

interface Props {
  ticket: Ticket;
}

const RequestDetails: React.FC<Props> = ({ ticket }) => {
  const [content, setContent] = useState<string | undefined>("");
  const [header, setHeader] = useState<string | undefined>("");

  useEffect(() => {
    const setHeaderAndContent = () => {
      switch (ticket.statusId) {
        case TicketStatus.RESOLVED:
          setHeader(`Resolution - ${ticket.resolutionTime}`);
          setContent(ticket.resolution);
          break;
        case TicketStatus.CLOSED:
          setHeader("Closing Reason");
          setContent(ticket.closingReason);
          break;
        case TicketStatus.ON_HOLD:
          setHeader("On-hold");
          setContent(ticket.pauseReason);
          break;
        default:
          setHeader("Description");
          setContent(ticket.description);
          break;
      }
    };

    setHeaderAndContent();
  }, [ticket]);

  return (
    <div className="w-full rounded-lg shadow h-[109%] md:h-96 hover:shadow-blue-900 bg-slate-900">
      <div className="h-[5%] bg-blue-500 rounded-t-lg"></div>

      <div className="flex flex-col gap-2 mx-4">
        <h4 className="flex items-center gap-2 mt-4 mb-4 first:font-medium">
          <i className={`${PrimeIcons.INFO_CIRCLE}`}></i>Request Details
        </h4>
        <div className="flex items-center justify-between">
          <UserDetails user={ticket.issuer} mode="normal" />

          <i className={`${PrimeIcons.ARROW_CIRCLE_RIGHT} text-xl`}></i>
          <UserDetails user={ticket.assignedUser} mode="normal" />
        </div>
      </div>

      <h4 className="flex items-center gap-2 mx-4 mt-5 mb-4 font-medium">
        <i className={`${PrimeIcons.INFO_CIRCLE}`}></i>
        {header}
      </h4>
      <InputTextarea
        value={content}
        className="w-[91%] md:w-[93%] mx-4 md:h-44 bg-slate-800 text-slate-100 disabled:opacity-100 disabled:text-slate-100"
        disabled
      />
    </div>
  );
};

export default RequestDetails;
