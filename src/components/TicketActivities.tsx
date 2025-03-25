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
        className="bg-slate-900 text-slate-100"
      >
        <p>{item.activity}</p>
      </Card>
    );
  };

  return (
    <div className="card">
      <Timeline
        value={ticket.activities}
        align="alternate"
        className="customized-timeline"
        content={customizedContent}
      />
    </div>
  );
};

export default TicketActivities;
