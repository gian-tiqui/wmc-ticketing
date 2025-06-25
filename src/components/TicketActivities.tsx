import React from "react";
import { Timeline } from "primereact/timeline";
import { Activity, Ticket } from "../types/types";
import { PrimeIcons } from "primereact/api";

interface Props {
  ticket: Ticket;
}

const TicketActivities: React.FC<Props> = ({ ticket }) => {
  const customizedContent = (item: Activity) => (
    <div className="relative group w-fit">
      {/* Hover Card */}
      <div className="absolute z-10 hidden w-64 p-3 mb-2 transition-all duration-200 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-md bottom-full left-1/2 group-hover:block">
        <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
        <p className="mb-1 text-xs text-gray-500">{item.createdAt}</p>
        <p className="text-sm text-gray-700">{item.activity}</p>
      </div>

      {/* Below Dot Label */}
      <div className="mt-2 text-xs font-medium text-center text-gray-700">
        {item.title.split(" ")[1]}
      </div>
    </div>
  );

  const customizedMarker = (item: Activity) => (
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 text-white ${
        item.type === "resolved"
          ? "bg-green-600 hover:bg-green-700"
          : item.activity === "closed"
          ? "bg-gray-500 hover:bg-gray-600"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      <i className={`${item.icon ?? PrimeIcons.INFO_CIRCLE} text-xs`} />
    </div>
  );

  return (
    <div className="max-w-5xl p-6 mx-auto overflow-x-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-50">
            <i className={`${PrimeIcons.HISTORY} text-blue-600 text-lg`}></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Ticket Activity History
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          See a record of all ticket-related actions for auditing and tracking.
        </p>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto">
        <Timeline
          value={ticket.activities}
          layout="horizontal"
          align="top"
          content={customizedContent}
          marker={customizedMarker}
          className="min-w-[500px]"
        />
      </div>
    </div>
  );
};

export default TicketActivities;
