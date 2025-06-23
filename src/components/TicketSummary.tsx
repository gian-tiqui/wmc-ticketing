import {
  Calendar,
  Clock,
  CheckCircle,
  AlignCenter,
  User,
  ArrowRight,
  Info,
} from "lucide-react";
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
      className={`h-[80%] ${scrollbarTheme} space-y-10 overflow-auto text-gray-800 pb-8`}
    >
      {/* Top Header */}
      <section className="pb-6 border-b border-gray-300">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          {ticket.title}
        </h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
          <CheckCircle className="w-4 h-4" />
          {ticket.status.type}
        </div>
      </section>

      {/* Main Flex Layout */}
      <section className="flex flex-col gap-8 lg:flex-row">
        {/* Left Panel */}
        <div className="w-full space-y-6 lg:w-1/2">
          {/* Category */}
          <div>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <AlignCenter className="w-4 h-4" /> Category
            </p>
            <h2 className="mt-1 text-base font-semibold">
              {ticket.category.name}
            </h2>
          </div>

          {/* Issuer → Assigned */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">
                {ticket.issuer.firstName} {ticket.issuer.lastName}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500" />
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">
                {ticket.assignedUser?.firstName
                  ? `${ticket.assignedUser.firstName} ${ticket.assignedUser.lastName}`
                  : "Unassigned"}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Requested: <span className="font-medium">{ticket.createdAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Acknowledged:{" "}
              <span className="font-medium">
                {ticket.acknowledgedAt || "Not yet"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel - Request Details + Extra Info */}
        <div className="w-full space-y-6 lg:w-1/2">
          {/* Request Details (formerly its own component) */}
          {/* Redesigned Request Details */}
          <div className="p-6 space-y-6 bg-white border border-gray-100 shadow-md rounded-2xl">
            {/* User Info Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-500" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">
                    {ticket.issuer.firstName} {ticket.issuer.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Requested By</p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-gray-400" />

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-green-500" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">
                    {ticket.assignedUser?.firstName
                      ? `${ticket.assignedUser.firstName} ${ticket.assignedUser.lastName}`
                      : "Unassigned"}
                  </p>
                  <p className="text-xs text-gray-500">Assigned To</p>
                </div>
              </div>
            </div>

            {/* Header & Textarea */}
            <div>
              <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <Info className="w-4 h-4 text-blue-500" />
                {header}
              </h4>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {content || "No details provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Additional Info
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-medium">SLA:</span>{" "}
                {ticket.category.SLA
                  ? `${ticket.category.SLA} ${
                      ticket.category.SLA === 1 ? "hour" : "hours"
                    }`
                  : "N/A"}
              </li>
              <li>
                <span className="font-medium">Report Required:</span>{" "}
                {ticket.reportRequired ? "Yes" : "No"}
              </li>
              {ticket.pauseReason && (
                <li>
                  <span className="font-medium">Pause Reason:</span>{" "}
                  {ticket.pauseReason}
                </li>
              )}
              {ticket.closingReason && (
                <li>
                  <span className="font-medium">Closing Reason:</span>{" "}
                  {ticket.closingReason}
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TicketSummary;
