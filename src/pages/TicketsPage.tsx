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
      header: (
        <div className="flex items-center">
          <p>
            {newTicketsData?.data.count > 0 && `${newTicketsData?.data.count}`}{" "}
            - New
          </p>
        </div>
      ),
      body:
        newTicketsData?.data.count > 0 ? (
          <TicketsTable tickets={newTicketsData?.data.tickets} />
        ) : (
          <p className="text-sm font-medium">No Tickets yet</p>
        ),
    },
    {
      icon: PrimeIcons.CHECK,
      header: (
        <div className="flex items-center">
          <p>
            {acknowledgeTicketsData?.data.count > 0 &&
              `${acknowledgeTicketsData?.data.count} - `}{" "}
            Acknowledged
          </p>
        </div>
      ),
      body:
        acknowledgeTicketsData?.data.count > 0 ? (
          <TicketsTable tickets={acknowledgeTicketsData?.data.tickets} />
        ) : (
          <p className="text-sm font-medium">No Tickets yet</p>
        ),
    },
    {
      icon: PrimeIcons.USER_PLUS,
      header: (
        <div className="flex items-center">
          <p>
            Assigned
            <span className="text-slate-100">
              {assignedTickets?.data.count > 0 &&
                ` - ${assignedTickets?.data.count}`}
            </span>
          </p>
        </div>
      ),
      body:
        assignedTickets?.data.count > 0 ? (
          <TicketsTable tickets={assignedTickets?.data.tickets} />
        ) : (
          <p className="text-sm font-medium">No Tickets yet</p>
        ),
    },
    {
      icon: PrimeIcons.USER_PLUS,
      header: (
        <div className="flex items-center">
          <p>
            Escalated
            <span className="text-slate-100">
              {escalatedTickets?.data.count > 0 &&
                ` - ${escalatedTickets?.data.count}`}
            </span>
          </p>
        </div>
      ),
      body:
        escalatedTickets?.data.count > 0 ? (
          <TicketsTable tickets={escalatedTickets?.data.tickets} />
        ) : (
          <p className="text-sm font-medium">No Tickets yet</p>
        ),
    },
    {
      icon: PrimeIcons.PAUSE,
      header: (
        <div className="flex items-center">
          <p>
            On-hold
            <span className="text-slate-100">
              {onHoldTickets?.data.count > 0 &&
                ` - ${onHoldTickets?.data.count}`}
            </span>
          </p>
        </div>
      ),
      body:
        onHoldTickets?.data.count > 0 ? (
          <TicketsTable tickets={onHoldTickets?.data.tickets} />
        ) : (
          <p className="text-sm font-medium">No Tickets yet</p>
        ),
    },
    {
      icon: PrimeIcons.CHECK_CIRCLE,
      header: (
        <div className="flex items-center">
          <p>
            Resolved
            <span className="text-slate-100">
              {resolvedTickets?.data.count > 0 &&
                ` - ${resolvedTickets?.data.count}`}
            </span>
          </p>
        </div>
      ),
      body:
        resolvedTickets?.data.count > 0 ? (
          <TicketsTable tickets={resolvedTickets?.data.tickets} />
        ) : (
          <p className="text-sm font-medium">No Tickets yet</p>
        ),
    },
    {
      icon: PrimeIcons.CHECK_CIRCLE,
      header: (
        <div className="flex items-center">
          <p>
            Closed
            <span className="text-slate-100">
              {closedTickets?.data.count > 0 &&
                ` - ${closedTickets?.data.count}`}
            </span>
          </p>
        </div>
      ),
      body:
        closedTickets?.data.count > 0 ? (
          <TicketsTable tickets={closedTickets?.data.tickets} />
        ) : (
          <p className="text-sm font-medium">No Tickets yet</p>
        ),
    },
  ];

  return (
    <PageTemplate>
      <div className="w-full h-full p-4 bg-inherit">
        <div className="flex items-center justify-between mb-10">
          <h4 className={` text-2xl font-medium ${!isExpanded && "ms-14"} `}>
            Tickets
          </h4>
          <div className="flex gap-2">
            <SearchButton />
            <InboxButton />
            <NewTicketButton refetchAll={refetchAll} />
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
