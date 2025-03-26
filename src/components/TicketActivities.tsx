import React from "react";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
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
      <Card
        title={item.title}
        subTitle={item.createdAt}
        className="bg-slate-800 text-slate-100"
      >
        <p>{item.activity}</p>
      </Card>
    );
  };

  const customizedMarker = (item: Activity) => {
    return (
      <div className="grid w-10 h-10 bg-blue-500 rounded-full place-content-center">
        <i className={`${item.icon}`}></i>
      </div>
    );
  };

  return (
    <div className="w-full p-4 overflow-y-auto h-96 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
      <Timeline
        value={ticket.activities}
        align="alternate"
        className="customized-timeline"
        content={customizedContent}
        marker={customizedMarker}
      />
    </div>
  );
};

export default TicketActivities;
