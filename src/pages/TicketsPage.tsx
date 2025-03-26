import { TabPanel, TabView } from "primereact/tabview";
import PageTemplate from "../templates/PageTemplate";
import useCrmSidebarStore from "../@utils/store/crmSidebar";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import NewTicketButton from "../components/NewTicketButton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Query, TicketsPageTabItems } from "../types/types";
import { getTickets } from "../@utils/services/ticketService";
import TicketsTable from "../components/TicketsTable";
import useUserDataStore from "../@utils/store/userDataStore";
import roleIncludes from "../@utils/functions/rolesIncludes";
import { getUserTicketsById } from "../@utils/services/userService";

const TicketsPage = () => {
  const { isExpanded } = useCrmSidebarStore();
  const { user } = useUserDataStore();
  const [query] = useState<Query>({ search: "" });
  const { data: newTicketsData, refetch } = useQuery({
    queryKey: [`new-tickets-${JSON.stringify({ ...query, statusId: 1 })}`],
    queryFn: () =>
      roleIncludes(user, "admin")
        ? getTickets({ ...query, statusId: 1 })
        : getUserTicketsById(user?.sub, query),
  });

  const tabs: TicketsPageTabItems[] = [
    {
      icon: PrimeIcons.PLUS,
      header: (
        <div className="flex items-center">
          <p>New</p>
          <Avatar
            label={newTicketsData?.data.count}
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <TicketsTable tickets={newTicketsData?.data.tickets} />,
    },
    {
      icon: PrimeIcons.CHECK,
      header: (
        <div className="flex items-center">
          <p>Acknowledged</p>
          <Avatar
            label="0"
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <div></div>,
    },
    {
      icon: PrimeIcons.USER_PLUS,
      header: (
        <div className="flex items-center">
          <p>Assigned</p>
          <Avatar
            label="0"
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <div></div>,
    },
    {
      icon: PrimeIcons.CHECK_CIRCLE,
      header: (
        <div className="flex items-center">
          <p>Resolved</p>
          <Avatar
            label="0"
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <div></div>,
    },
    {
      icon: PrimeIcons.LOCK,
      header: (
        <div className="flex items-center">
          <p>Closed</p>
          <Avatar
            label="0"
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <div></div>,
    },
    {
      icon: PrimeIcons.CHECK_SQUARE,
      header: (
        <div className="flex items-center">
          <p>CR</p>
          <Avatar
            label="0"
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <div></div>,
    },
  ];

  return (
    <PageTemplate>
      <div className="w-full h-full p-4 bg-inherit">
        <div className="flex items-center justify-between mb-10">
          <h4 className={` text-2xl font-medium ${!isExpanded && "ms-14"} `}>
            <i className={`${PrimeIcons.TICKET} text-xl rotate-90`}></i> Tickets
          </h4>
          <NewTicketButton refetch={refetch} />
        </div>

        <TabView
          pt={{
            panelContainer: {
              className: "h-[73vh] w-full bg-inherit",
            },
            nav: { className: "w-full bg-inherit" },
            tab: { className: "w-full bg-inherit" },
          }}
        >
          {tabs.map((tab) => (
            <TabPanel
              pt={{ headerAction: { className: "bg-inherit" } }}
              header={tab.header}
              leftIcon={`${tab.icon} me-2`}
            >
              {tab.body}
            </TabPanel>
          ))}
        </TabView>
      </div>
    </PageTemplate>
  );
};

export default TicketsPage;
