import React from "react";
import { Timeline } from "primereact/timeline";
import { Activity, Ticket } from "../types/types";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface Props {
  ticket: Ticket;
}

const TicketActivities: React.FC<Props> = ({ ticket }) => {
  const customizedContent = (item: Activity) => {
    return (
      <div className="relative group w-fit">
        <div className="absolute z-10 hidden w-64 p-3 mb-2 transition-all duration-200 -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-md bottom-full left-1/2 group-hover:block">
          <h3 className="text-sm font-semibold">{item.title}</h3>
          <p className="mb-1 text-xs text-gray-500">{item.createdAt}</p>
          <p className="text-sm">{item.activity}</p>
        </div>

        <div className="mt-2 text-xs font-medium text-center text-gray-700">
          {item.title.split(" ")[1]}
        </div>
      </div>
    );
  };

  const customizedMarker = (item: Activity) => {
    return (
      <div className="grid text-white transition duration-200 bg-blue-600 rounded-full w-7 h-7 group place-content-center hover:bg-blue-700">
        <i className={`${item.icon} text-xs`}></i>
      </div>
    );
  };

  return (
    <div className="p-4 pt-10 mx-auto overflow-x-auto ">
      <Timeline
        value={ticket.activities}
        layout="horizontal"
        align="top"
        content={customizedContent}
        marker={customizedMarker}
        className="min-w-[500px]"
      />
    </div>
  );
};

export default TicketActivities;
