import { TabPanel, TabView } from "primereact/tabview";
import PageTemplate from "../templates/PageTemplate";
import useCrmSidebarStore from "../@utils/store/crmSidebar";
import { PrimeIcons } from "primereact/api";
import NewTicketButton from "../components/NewTicketButton";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback, memo } from "react";
import { Query, TicketsPageTabItems, UserData } from "../types/types";
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

// Memoized TabHeader component to prevent unnecessary re-renders
const TabHeader = memo(
  ({ label, count }: { label: string; count?: number }) => (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      {count && count > 0 && (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {count}
        </span>
      )}
    </div>
  )
);

TabHeader.displayName = "TabHeader";

// Memoized EmptyState component
const EmptyState = memo(() => (
  <small className="text-xs font-medium">No Tickets yet</small>
));

EmptyState.displayName = "EmptyState";

// Custom hook for ticket queries with optimized caching
const useTicketQuery = (
  status: TicketStatus,
  user: UserData | undefined,
  query: Query
) => {
  const isAdmin = useMemo(() => roleIncludes(user, "admin"), [user]);

  return useQuery({
    queryKey: [
      `tickets-${status}`,
      user?.sub,
      user?.deptId,
      query.search,
      query.limit,
      isAdmin,
    ],
    queryFn: () => {
      const queryWithStatus = { ...query, statusId: status };
      return isAdmin
        ? getTickets(queryWithStatus)
        : getUserTicketsById(user?.sub, queryWithStatus);
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    enabled: !!user?.sub,
  });
};

const TicketsPage = () => {
  const { isExpanded } = useCrmSidebarStore();
  const { user } = useUserDataStore();

  // Memoize the query object to prevent unnecessary re-renders
  const query = useMemo<Query>(
    () => ({
      search: "",
      deptId: user?.deptId,
      limit: 10000,
    }),
    [user?.deptId]
  );

  // Use custom hook for all ticket queries
  const newTicketsQuery = useTicketQuery(TicketStatus.NEW, user, query);
  const acknowledgedTicketsQuery = useTicketQuery(
    TicketStatus.ACKNOWLEDGED,
    user,
    query
  );
  const assignedTicketsQuery = useTicketQuery(
    TicketStatus.ASSIGNED,
    user,
    query
  );
  const escalatedTicketsQuery = useTicketQuery(
    TicketStatus.ESCALATED,
    user,
    query
  );
  const resolvedTicketsQuery = useTicketQuery(
    TicketStatus.RESOLVED,
    user,
    query
  );
  const closedTicketsQuery = useTicketQuery(TicketStatus.CLOSED, user, query);
  const onHoldTicketsQuery = useTicketQuery(TicketStatus.ON_HOLD, user, query);

  // Memoized refetch function
  const refetchAll = useCallback(() => {
    newTicketsQuery.refetch();
    acknowledgedTicketsQuery.refetch();
    assignedTicketsQuery.refetch();
    escalatedTicketsQuery.refetch();
    resolvedTicketsQuery.refetch();
    closedTicketsQuery.refetch();
    onHoldTicketsQuery.refetch();
  }, [
    newTicketsQuery.refetch,
    acknowledgedTicketsQuery.refetch,
    assignedTicketsQuery.refetch,
    escalatedTicketsQuery.refetch,
    resolvedTicketsQuery.refetch,
    closedTicketsQuery.refetch,
    onHoldTicketsQuery.refetch,
  ]);

  // Memoized function to create tab body
  const createTabBody = useCallback((data: any) => {
    const count = data?.data?.count || 0;
    const tickets = data?.data?.tickets;

    return count > 0 ? <TicketsTable tickets={tickets} /> : <EmptyState />;
  }, []);

  // Memoized tabs configuration
  const tabs = useMemo(
    (): TicketsPageTabItems[] => [
      {
        icon: PrimeIcons.PLUS,
        header: (
          <TabHeader label="New" count={newTicketsQuery.data?.data?.count} />
        ),
        body: createTabBody(newTicketsQuery.data),
      },
      {
        icon: PrimeIcons.CHECK,
        header: (
          <TabHeader
            label="Acknowledged"
            count={acknowledgedTicketsQuery.data?.data?.count}
          />
        ),
        body: createTabBody(acknowledgedTicketsQuery.data),
      },
      {
        icon: PrimeIcons.USERS,
        header: (
          <TabHeader
            label="Assigned"
            count={assignedTicketsQuery.data?.data?.count}
          />
        ),
        body: createTabBody(assignedTicketsQuery.data),
      },
      {
        icon: PrimeIcons.USER_PLUS,
        header: (
          <TabHeader
            label="Escalated"
            count={escalatedTicketsQuery.data?.data?.count}
          />
        ),
        body: createTabBody(escalatedTicketsQuery.data),
      },
      {
        icon: PrimeIcons.PAUSE,
        header: (
          <TabHeader
            label="On-Hold"
            count={onHoldTicketsQuery.data?.data?.count}
          />
        ),
        body: createTabBody(onHoldTicketsQuery.data),
      },
      {
        icon: PrimeIcons.CHECK_CIRCLE,
        header: (
          <TabHeader
            label="Resolved"
            count={resolvedTicketsQuery.data?.data?.count}
          />
        ),
        body: createTabBody(resolvedTicketsQuery.data),
      },
      {
        icon: PrimeIcons.CHECK_CIRCLE,
        header: (
          <TabHeader
            label="Closed"
            count={closedTicketsQuery.data?.data?.count}
          />
        ),
        body: createTabBody(closedTicketsQuery.data),
      },
    ],
    [
      newTicketsQuery.data,
      acknowledgedTicketsQuery.data,
      assignedTicketsQuery.data,
      escalatedTicketsQuery.data,
      onHoldTicketsQuery.data,
      resolvedTicketsQuery.data,
      closedTicketsQuery.data,
      createTabBody,
    ]
  );

  // Memoized filtered tabs (remove escalated tab for non-admins)
  const filteredTabs = useMemo(() => {
    const isAdmin = roleIncludes(user, "admin");
    return tabs.filter((_, index) => {
      // Remove escalated tab (index 3) for non-admins
      if (index === 3 && !isAdmin) return false;
      return true;
    });
  }, [tabs, user]);

  // Memoized header title classes
  const headerTitleClasses = useMemo(
    () =>
      `text-xl sm:text-2xl font-bold text-white ${
        !isExpanded && "ms-0 sm:ms-14"
      }`,
    [isExpanded]
  );

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
                  <h1 className={headerTitleClasses}>Ticket Management</h1>
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
            {filteredTabs.map((tab, index) => (
              <TabPanel
                key={`tab-${index}`}
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

export default memo(TicketsPage);
