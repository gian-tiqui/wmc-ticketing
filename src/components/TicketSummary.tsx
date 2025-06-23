import { Calendar, CheckCircle, AlignCenter, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Ticket } from "../types/types";
import { TicketStatus } from "../@utils/enums/enum";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";

interface Props {
  ticket: Ticket;
}

const TicketSummary: React.FC<Props> = ({ ticket }) => {
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
    <div
      className={`${scrollbarTheme} px-4 py-8 mx-auto space-y-6 text-gray-800 max-w-7xl overflow-auto h-[62%]`}
    >
      {/* Title & Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-blue-600 sm:text-3xl">
              {ticket.title}
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 border border-blue-200 rounded-full">
              <CheckCircle className="w-4 h-4" />
              {ticket.status.type}
            </span>
          </div>
          <p className="text-gray-600">Ticket ID: #{ticket.id}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Created {ticket.createdAt}</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Category Card */}
          <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <AlignCenter className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Category</h2>
            </div>
            <p className="text-gray-700">{ticket.category.name}</p>
          </div>

          {/* Request Details */}
          <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-semibold text-blue-900">{header}</h2>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {content || "No details provided."}
            </p>
          </div>

          {/* Timeline */}
          <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Timeline
            </h3>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <span className="font-medium">Requested:</span>{" "}
                {ticket.createdAt}
              </p>
              <p>
                <span className="font-medium">Acknowledged:</span>{" "}
                {ticket.acknowledgedAt || "Not yet"}
              </p>
              {ticket.resolutionTime && (
                <p>
                  <span className="font-medium">Resolved:</span>{" "}
                  {ticket.resolutionTime}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* People Card */}
          <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">People</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="font-medium text-gray-900">Issuer</p>
                <p>
                  {ticket.issuer.firstName} {ticket.issuer.lastName}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Assigned To</p>
                <p>
                  {ticket.assignedUser
                    ? `${ticket.assignedUser.firstName} ${ticket.assignedUser.lastName}`
                    : "Unassigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Additional Info
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-medium">SLA:</span>{" "}
                {ticket.category.SLA
                  ? `${ticket.category.SLA} ${
                      ticket.category.SLA === 1 ? "hour" : "hours"
                    }`
                  : "N/A"}
              </p>
              <p>
                <span className="font-medium">Report Required:</span>{" "}
                {ticket.reportRequired ? "Yes" : "No"}
              </p>
              {ticket.pauseReason && (
                <p>
                  <span className="font-medium">Pause Reason:</span>{" "}
                  {ticket.pauseReason}
                </p>
              )}
              {ticket.closingReason && (
                <p>
                  <span className="font-medium">Closing Reason:</span>{" "}
                  {ticket.closingReason}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSummary;
