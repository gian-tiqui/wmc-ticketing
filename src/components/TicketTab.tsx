import React, { ReactNode } from "react";
import { Ticket, TicketTabs } from "../types/types";
import { TabPanel, TabView } from "primereact/tabview";
import TicketSummary from "./TicketSummary";

interface Props {
  ticket: Ticket;
}

const TicketTab: React.FC<Props> = ({ ticket }) => {
  const ticketTabComponents: TicketTabs[] = [
    { name: "Summary", component: <TicketSummary ticket={ticket} /> },
    { name: "Attachments", component: <TicketSummary ticket={ticket} /> },
    { name: "Service Reports", component: <TicketSummary ticket={ticket} /> },
    { name: "Comments", component: <TicketSummary ticket={ticket} /> },
    { name: "Activities", component: <TicketSummary ticket={ticket} /> },
  ];
  return (
    <div>
      <TabView
        pt={{
          panelContainer: { className: "h-full bg-inherit" },
          nav: { className: "bg-inherit" },
        }}
      >
        {ticketTabComponents.map((tab) => (
          <TabPanel
            header={tab.name}
            pt={{
              content: { className: "h-80 bg-inherit text-slate-100" },
              header: { className: "bg-inherit" },
              headerAction: { className: "bg-inherit" },
            }}
          >
            {tab.component}
          </TabPanel>
        ))}
      </TabView>
    </div>
  );
};

export default TicketTab;
