import React from "react";
import { Ticket, TicketTabs } from "../types/types";
import { TabPanel, TabView } from "primereact/tabview";
import TicketSummary from "./TicketSummary";
import TicketComments from "./TicketComments";
import TicketActivities from "./TicketActivities";
import TicketAction from "./TicketAction";
import TicketServiceReport from "./TicketServiceReports";

interface Props {
  ticket: Ticket;
}

const TicketTab: React.FC<Props> = ({ ticket }) => {
  const ticketTabComponents: TicketTabs[] = [
    { name: "Summary", component: <TicketSummary ticket={ticket} /> },
    {
      name: "Service Reports",
      component: <TicketServiceReport ticket={ticket} />,
    },
    {
      name: "Comments",
      component: <TicketComments ticket={ticket} />,
    },
    { name: "Activities", component: <TicketActivities ticket={ticket} /> },
    { name: "Actions", component: <TicketAction ticket={ticket} /> },
  ];
  return (
    <div>
      <TabView
        pt={{
          panelContainer: { className: "h-full bg-inherit" },
          nav: { className: "bg-inherit" },
        }}
      >
        {ticketTabComponents.map((tab, index) => (
          <TabPanel
            key={index}
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
