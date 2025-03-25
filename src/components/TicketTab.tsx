import React from "react";
import { Ticket, TicketTabs } from "../types/types";
import { TabPanel, TabView } from "primereact/tabview";
import TicketSummary from "./TicketSummary";
import TicketComments from "./TicketComments";
import TicketActivities from "./TicketActivities";
import TicketAction from "./TicketAction";
import TicketServiceReport from "./TicketServiceReports";
import { PrimeIcons } from "primereact/api";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const TicketTab: React.FC<Props> = ({ ticket, refetch }) => {
  const ticketTabComponents: TicketTabs[] = [
    {
      name: "Summary",
      component: <TicketSummary ticket={ticket} />,
      icon: "pi pi-wave-pulse",
    },
    {
      name: "Service Reports",
      component: <TicketServiceReport ticket={ticket} />,
      icon: "pi pi-file-edit",
    },
    {
      name: "Comments",
      component: <TicketComments ticket={ticket} refetch={refetch} />,
      icon: PrimeIcons.COMMENTS,
    },
    {
      name: "Activities",
      component: <TicketActivities ticket={ticket} />,
      icon: PrimeIcons.HISTORY,
    },
    {
      name: "Actions",
      component: <TicketAction ticket={ticket} />,
      icon: PrimeIcons.LIST,
    },
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
            leftIcon={`${tab.icon} me-2`}
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
