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
  const [query] = useState<Query>({
    search: "",
    deptId: user?.deptId,
    limit: 500,
  });
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
      <div className="w-full min-h-screen bg-[#EEE]">
        {/* Header Section */}
        <div className="relative p-3 mb-4 overflow-hidden sm:p-4 lg:p-6 sm:mb-6 lg:mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left Side - Title and Icon */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                  <i
                    className={`${PrimeIcons.TICKET} text-white text-lg sm:text-xl`}
                  ></i>
                </div>
                <div>
                  <h1
                    className={`text-xl sm:text-2xl font-bold text-white ${
                      !isExpanded && "ms-0 sm:ms-14"
                    }`}
                  >
                    Ticket Management
                  </h1>
                  <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                    Track, manage, and resolve support tickets
                  </p>
                </div>
              </div>

              {/* Right Side - Action Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-max">
                  <SearchButton />
                  <SentTicketsButton />
                  <InboxButton />
                  <NewTicketButton refetchAll={refetchAll} />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute w-16 h-16 rounded-full sm:w-24 sm:h-24 -top-4 -right-4 bg-white/5 blur-xl"></div>
          <div className="absolute w-20 h-20 rounded-full sm:w-32 sm:h-32 -bottom-8 -left-8 bg-white/5 blur-2xl"></div>
        </div>

        {/* Content Section */}
        <div className="px-3 pb-3 sm:px-4 lg:px-6 sm:pb-4 lg:pb-6">
          <TabView
            pt={{
              panelContainer: {
                className: `${scrollbarTheme} h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)] lg:h-[67vh] overflow-auto w-full bg-[#EEE]`,
              },
              nav: {
                className:
                  "w-full bg-transparent border-b border-slate-200/50 px-2 sm:px-4 lg:px-6 pt-3 sm:pt-4 lg:pt-6",
              },
              tab: {
                className: "mx-0.5 sm:mx-1",
              },
              navContent: {
                className: "flex gap-1 sm:gap-2 overflow-x-auto pb-2",
              },
            }}
          >
            {tabs.map((tab, index) => (
              <TabPanel
                key={index}
                pt={{
                  headerAction: {
                    className:
                      "px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 hover:bg-slate-100/80 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg whitespace-nowrap",
                  },
                }}
                header={tab.header}
                headerClassName="text-xs sm:text-sm font-medium"
              >
                <div className="animate-fadeIn">{tab.body}</div>
              </TabPanel>
            ))}
          </TabView>
        </div>
      </div>
    </PageTemplate>
  );
};

export default TicketsPage;
