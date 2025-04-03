import React from "react";
import { Ticket } from "../types/types";
import ServiceReportItem from "./ServiceReportItem";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";

interface Props {
  ticket: Ticket;
}

const TicketServiceReport: React.FC<Props> = ({ ticket }) => {
  return (
    <div className={`overflow-auto h-96 ${scrollbarTheme}`}>
      {ticket.serviceReports &&
        ticket.serviceReports.length > 0 &&
        ticket.serviceReports.map((serviceReport) => (
          <div key={serviceReport.id} className="mb-6">
            <p>
              {serviceReport.serviceReporter.firstName}{" "}
              {serviceReport.serviceReporter.lastName}'s Service Report
            </p>{" "}
            <p className="mb-2 text-sm text-gray-400">
              {serviceReport.createdAt}
            </p>
            <div
              className={`${scrollbarTheme} flex flex-col gap-3 p-3 overflow-x-auto rounded h-72 bg-slate-700`}
            >
              {serviceReport.imageLocations.map((imageLocation) => (
                <ServiceReportItem
                  key={imageLocation.id}
                  imageLocation={imageLocation}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default TicketServiceReport;
