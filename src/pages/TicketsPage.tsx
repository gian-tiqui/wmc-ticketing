import { TabPanel, TabView } from "primereact/tabview";
import PageTemplate from "../templates/PageTemplate";
import useCrmSidebarStore from "../@utils/store/crmSidebar";
import { PrimeIcons } from "primereact/api";
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
import SearchButton from "../components/SearchButton";
import SentTicketsButton from "../components/SentTicketsButton";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";

const TabHeader = ({ label, count }: { label: string; count?: number }) => (
  <div className="flex items-center gap-2">
    <span>{label}</span>
    {count && count > 0 && (
      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        {count}
      </span>
    )}
  </div>
);

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
        ? getTickets({ ...query, statusId: TicketStatus.NEW })
        : getUserTicketsById(user?.sub, {
            ...query,
            statusId: TicketStatus.NEW,
          }),
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
          : getUserTicketsById(user?.sub, {
              ...query,
              statusId: TicketStatus.ACKNOWLEDGED,
            }),
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
        : getUserTicketsById(user?.sub, {
            ...query,
            statusId: TicketStatus.ASSIGNED,
          }),
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
          : getUserTicketsById(user?.sub, {
              ...query,
              statusId: TicketStatus.ESCALATED,
            }),
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
        : getUserTicketsById(user?.sub, {
            ...query,
            statusId: TicketStatus.RESOLVED,
          }),
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
        : getUserTicketsById(user?.sub, {
            ...query,
            statusId: TicketStatus.CLOSED,
          }),
  });

  const { data: onHoldTickets, refetch: refetchOnHoldTickets } = useQuery({
    queryKey: [
      `on-hold-tickets-${JSON.stringify({
        ...query,
        statusId: TicketStatus.ON_HOLD,
      })}`,
    ],
    queryFn: () =>
      roleIncludes(user, "admin")
        ? getTickets({ ...query, statusId: TicketStatus.ON_HOLD })
        : getUserTicketsById(user?.sub, {
            ...query,
            statusId: TicketStatus.ON_HOLD,
          }),
  });

  const refetchAll = () => {
    refetchNewTickets();
    refetchAcknowledgedTickets();
    refetchAssignedTickets();
    refetchClosedTickets();
    refetchResolvedTickets();
    refetchEscalatedTickets();
    refetchOnHoldTickets();
  };

  const tabs: TicketsPageTabItems[] = [
    {
      icon: PrimeIcons.PLUS,
      header: <TabHeader label="New" count={newTicketsData?.data.count} />,
      body:
        newTicketsData?.data.count > 0 ? (
          <TicketsTable tickets={newTicketsData?.data.tickets} />
        ) : (
          <small className="text-xs font-medium">No Tickets yet</small>
        ),
    },
    {
      icon: PrimeIcons.CHECK,
      header: (
        <TabHeader
          label="Acknowledged"
          count={acknowledgeTicketsData?.data.count}
        />
      ),
      body:
        acknowledgeTicketsData?.data.count > 0 ? (
          <TicketsTable tickets={acknowledgeTicketsData?.data.tickets} />
        ) : (
          <small className="text-xs font-medium">No Tickets yet</small>
        ),
    },
    {
      icon: PrimeIcons.USER_PLUS,
      header: (
        <TabHeader label="Assigned" count={assignedTickets?.data.count} />
      ),
      body:
        assignedTickets?.data.count > 0 ? (
          <TicketsTable tickets={assignedTickets?.data.tickets} />
        ) : (
          <small className="text-xs font-medium">No Tickets yet</small>
        ),
    },
    {
      icon: PrimeIcons.USER_PLUS,
      header: (
        <TabHeader label="Escalated" count={escalatedTickets?.data.count} />
      ),
      body:
        escalatedTickets?.data.count > 0 ? (
          <TicketsTable tickets={escalatedTickets?.data.tickets} />
        ) : (
          <small className="text-xs font-medium">No Tickets yet</small>
        ),
    },
    {
      icon: PrimeIcons.PAUSE,
      header: <TabHeader label="On-Hold" count={onHoldTickets?.data.count} />,
      body:
        onHoldTickets?.data.count > 0 ? (
          <TicketsTable tickets={onHoldTickets?.data.tickets} />
        ) : (
          <small className="text-xs font-medium">No Tickets yet</small>
        ),
    },
    {
      icon: PrimeIcons.CHECK_CIRCLE,
      header: (
        <TabHeader label="Resolved" count={resolvedTickets?.data.count} />
      ),
      body:
        resolvedTickets?.data.count > 0 ? (
          <TicketsTable tickets={resolvedTickets?.data.tickets} />
        ) : (
          <small className="text-xs font-medium">No Tickets yet</small>
        ),
    },
    {
      icon: PrimeIcons.CHECK_CIRCLE,
      header: <TabHeader label="Closed" count={closedTickets?.data.count} />,
      body:
        closedTickets?.data.count > 0 ? (
          <TicketsTable tickets={closedTickets?.data.tickets} />
        ) : (
          <small className="text-xs font-medium">No Tickets yet</small>
        ),
    },
  ];

  return (
    <PageTemplate>
      <div className="w-full h-full p-4 bg-inherit">
        <div className="flex items-center justify-between mb-10">
          <h4
            className={` text-lg text-blue-600 font-semibold ${
              !isExpanded && "ms-14"
            } `}
          >
            Tickets
          </h4>
          <div className="flex gap-2">
            <SearchButton />
            <SentTicketsButton />
            <InboxButton />
            <NewTicketButton refetchAll={refetchAll} />
          </div>
        </div>

        <TabView
          pt={{
            panelContainer: {
              className: `${scrollbarTheme} h-[73vh] overflow-auto w-full bg-inherit`,
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
              headerClassName="text-xs"
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
