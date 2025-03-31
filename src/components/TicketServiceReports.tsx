import React from "react";
import { Ticket } from "../types/types";

interface Props {
  ticket: Ticket;
}

const TicketServiceReport: React.FC<Props> = ({ ticket }) => {
  return (
    <div>
      {ticket.serviceReports &&
        ticket.serviceReports.length > 0 &&
        ticket.serviceReports.map((serviceReport) => (
          <p key={serviceReport.id}>
            {JSON.stringify(serviceReport.imageLocations)}
          </p>
        ))}
    </div>
  );
};

export default TicketServiceReport;
