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
import { TicketStatus } from "../@utils/enums/enum";
import InboxButton from "../components/InboxButton";

const TicketsPage = () => {
  const { isExpanded } = useCrmSidebarStore();
  const { user } = useUserDataStore();
  const [query] = useState<Query>({ search: "", deptId: user?.deptId });
  const { data: newTicketsData, refetch: refetchNewTickets } = useQuery({
    queryKey: [
      `new-tickets-${JSON.stringify({ ...query, statusId: TicketStatus.NEW })}`,
    ],
    queryFn: () =>
      roleIncludes(user, "admin")
        ? getTickets({ ...query, statusId: 1 })
        : getUserTicketsById(user?.sub, query),
  });

  const { data: acknowledgeTicketsData, refetch: refetchAcknowledgedTickets } =
    useQuery({
      queryKey: [
        `acknowledged-tickets-${JSON.stringify({
          ...query,
          statusId: TicketStatus.ACKNOWLEDGED,
        })}`,
      ],
      queryFn: () =>
        roleIncludes(user, "admin")
          ? getTickets({ ...query, statusId: TicketStatus.ACKNOWLEDGED })
          : getUserTicketsById(user?.sub, query),
    });

  const { data: assignedTickets, refetch: refetchAssignedTickets } = useQuery({
    queryKey: [
      `assigned-tickets-${JSON.stringify({
        ...query,
        statusId: TicketStatus.ASSIGNED,
      })}`,
    ],
    queryFn: () =>
      roleIncludes(user, "admin")
        ? getTickets({ ...query, statusId: TicketStatus.ASSIGNED })
        : getUserTicketsById(user?.sub, query),
  });

  const { data: escalatedTickets, refetch: refetchEscalatedTickets } = useQuery(
    {
      queryKey: [
        `assigned-tickets-${JSON.stringify({
          ...query,
          statusId: TicketStatus.ESCALATED,
        })}`,
      ],
      queryFn: () =>
        roleIncludes(user, "admin")
          ? getTickets({ ...query, statusId: TicketStatus.ESCALATED })
          : getUserTicketsById(user?.sub, query),
    }
  );

  const { data: resolvedTickets, refetch: refetchResolvedTickets } = useQuery({
    queryKey: [
      `assigned-tickets-${JSON.stringify({
        ...query,
        statusId: TicketStatus.RESOLVED,
      })}`,
    ],
    queryFn: () =>
      roleIncludes(user, "admin")
        ? getTickets({ ...query, statusId: TicketStatus.RESOLVED })
        : getUserTicketsById(user?.sub, query),
  });

  const { data: closedTickets, refetch: refetchClosedTickets } = useQuery({
    queryKey: [
      `assigned-tickets-${JSON.stringify({
        ...query,
        statusId: TicketStatus.CLOSED,
      })}`,
    ],
    queryFn: () =>
      roleIncludes(user, "admin")
        ? getTickets({ ...query, statusId: TicketStatus.CLOSED })
        : getUserTicketsById(user?.sub, query),
  });

  const refetchAll = () => {
    refetchNewTickets();
    refetchAcknowledgedTickets();
    refetchAssignedTickets();
    refetchClosedTickets();
    refetchResolvedTickets();
    refetchEscalatedTickets();
  };

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
            label={acknowledgeTicketsData?.data.count}
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <TicketsTable tickets={acknowledgeTicketsData?.data.tickets} />,
    },
    {
      icon: PrimeIcons.USER_PLUS,
      header: (
        <div className="flex items-center">
          <p>Assigned</p>
          <Avatar
            label={assignedTickets?.data.count}
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <TicketsTable tickets={assignedTickets?.data.tickets} />,
    },
    {
      icon: PrimeIcons.USER_PLUS,
      header: (
        <div className="flex items-center">
          <p>Escalated</p>
          <Avatar
            label={escalatedTickets?.data.count}
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <TicketsTable tickets={escalatedTickets?.data.tickets} />,
    },
    {
      icon: PrimeIcons.CHECK_CIRCLE,
      header: (
        <div className="flex items-center">
          <p>Resolved</p>
          <Avatar
            label={resolvedTickets?.data.count}
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <TicketsTable tickets={resolvedTickets?.data.tickets} />,
    },
    {
      icon: PrimeIcons.CHECK_CIRCLE,
      header: (
        <div className="flex items-center">
          <p>Closed</p>
          <Avatar
            label={closedTickets?.data.count}
            shape="circle"
            className="w-6 h-6 text-white bg-blue-400 ms-2"
          />
        </div>
      ),
      body: <TicketsTable tickets={closedTickets?.data.tickets} />,
    },
  ];

  return (
    <PageTemplate>
      <div className="w-full h-full p-4 bg-inherit">
        <div className="flex items-center justify-between mb-10">
          <h4 className={` text-2xl font-medium ${!isExpanded && "ms-14"} `}>
            <i className={`${PrimeIcons.TICKET} text-xl rotate-90`}></i> Tickets
          </h4>
          <div className="flex gap-2">
            <InboxButton />
            <NewTicketButton refetch={refetchNewTickets} />
          </div>
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
          {tabs.map((tab, index) => (
            <TabPanel
              key={index}
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
