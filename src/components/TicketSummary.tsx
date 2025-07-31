import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import {
  Calendar,
  AlignCenter,
  Info,
  User,
  Clock,
  FileText,
  AlertCircle,
  Target,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Ticket } from "../types/types";

// Mock types for demonstration

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const TicketStatus = {
  RESOLVED: 5,
  CLOSED: 6,
  ON_HOLD: 7,
};

const TicketStatusSection = ({ ticket }: Props) => (
  <div className="p-6 border border-indigo-100 shadow-sm bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-indigo-100 rounded-xl">
        <Target className="w-5 h-5 text-indigo-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Status Management</h2>
    </div>
    <div className="flex items-center gap-4">
      <div className="px-4 py-2 bg-white border border-indigo-100 shadow-sm rounded-xl">
        <span className="text-sm font-medium text-indigo-600">
          Current Status
        </span>
        <p className="font-semibold text-gray-900">{ticket.status.type}</p>
      </div>
      <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
          style={{ width: "60%" }}
        ></div>
      </div>
    </div>
  </div>
);

const TicketSummary: React.FC<Props> = ({ ticket, refetch }) => {
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

  const getStatusColor = (status: string) => {
    const colors = {
      Open: "bg-emerald-100 text-emerald-700 border-emerald-200",
      "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
      Resolved: "bg-green-100 text-green-700 border-green-200",
      Closed: "bg-gray-100 text-gray-700 border-gray-200",
      "On Hold": "bg-amber-100 text-amber-700 border-amber-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-6 py-8 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white border border-indigo-100 shadow-sm rounded-2xl">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold leading-tight text-gray-900">
                    {ticket.title}
                  </h1>
                  <p className="mt-1 text-gray-500">Ticket #{ticket.id}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border shadow-sm ${getStatusColor(
                    ticket.status.type
                  )}`}
                >
                  <div className="w-2 h-2 bg-current rounded-full opacity-75"></div>
                  {ticket.status.type}
                </span>

                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Created {ticket.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="mb-8">
          <TicketStatusSection ticket={ticket} refetch={refetch} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Primary Content - Takes up 2 columns on xl screens */}
          <div className="space-y-6 xl:col-span-2">
            {/* Description/Content Card */}
            <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm group rounded-2xl hover:shadow-md">
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 group-hover:opacity-100"></div>
              <div className="relative p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 transition-colors duration-300 bg-blue-100 rounded-xl group-hover:bg-blue-200">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{header}</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {content || ticket.description || "No details provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Card */}
            <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
              <div className="p-6 border-b bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <AlignCenter className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Category & SLA
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {ticket.category.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Primary category
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-700 rounded-xl">
                      <Clock className="w-4 h-4" />
                      {ticket.category.SLA
                        ? `${ticket.category.SLA}h SLA`
                        : "No SLA"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* People Card */}
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    People
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                      Issuer
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {ticket.issuer.firstName} {ticket.issuer.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                      Assigned To
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {ticket.assignedUser
                        ? `${ticket.assignedUser.firstName} ${ticket.assignedUser.lastName}`
                        : "Unassigned"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="p-6 border-b bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Timeline
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 mt-1 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">{ticket.createdAt}</p>
                  </div>
                </div>

                {ticket.acknowledgedAt && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-3 h-3 mt-1 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Acknowledged</p>
                      <p className="text-sm text-gray-600">
                        {ticket.acknowledgedAt}
                      </p>
                    </div>
                  </div>
                )}

                {ticket.resolutionTime && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-3 h-3 mt-1 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Resolved</p>
                      <p className="text-sm text-gray-600">
                        {ticket.resolutionTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="p-6 border-b bg-gradient-to-r from-rose-50 to-pink-50 border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Additional Info
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Report Required</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.reportRequired
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {ticket.reportRequired ? "Yes" : "No"}
                  </span>
                </div>

                {ticket.pauseReason && (
                  <div>
                    <p className="mb-1 font-medium text-gray-900">
                      Pause Reason
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.pauseReason}
                    </p>
                  </div>
                )}

                {ticket.closingReason && (
                  <div>
                    <p className="mb-1 font-medium text-gray-900">
                      Closing Reason
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.closingReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSummary;
