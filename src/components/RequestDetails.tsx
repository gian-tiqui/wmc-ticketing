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
        setHeader("On Hold");
        setContent(ticket.pauseReason);
        break;
      default:
        setHeader("Description");
        setContent(ticket.description);
        break;
    }
  }, [ticket]);

  return (
    <div className="border border-gray-200 bg-[#F5F7FA] rounded-xl shadow-sm p-5 hover:shadow-md transition">
      {/* User Section */}
      <div className="flex items-center justify-between mb-4">
        <UserDetails user={ticket.issuer} mode="normal" />
        <i className={`${PrimeIcons.ARROW_RIGHT} text-gray-500 text-lg`} />
        <UserDetails user={ticket.assignedUser} mode="normal" />
      </div>

      {/* Header */}
      <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
        <i className={PrimeIcons.INFO_CIRCLE}></i> {header}
      </h4>

      {/* Text Content */}
      <InputTextarea
        value={content}
        disabled
        autoResize
        className="w-full h-40 text-sm text-gray-800 bg-white rounded-lg disabled:opacity-100"
      />
    </div>
  );
};

export default RequestDetails;
