import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import useUserDataStore from "../@utils/store/userDataStore";
import {
  getTicketCountsByStatus,
  getSLAComplianceReport,
  getMostActiveUsers,
  getCommentAndReportStats,
  getOnHoldTickets,
} from "../@utils/services/dashboardService";

// Types
interface StatusCount {
  status: string;
  count: number;
}

interface SLACompliance {
  met: number;
  breached: number;
}

interface MostActiveUser {
  name: string;
  activities: number;
}

interface EngagementStats {
  comments: number;
  reports: number;
}

interface OnHoldTicket {
  title: string;
  pauseReason: string;
}

// WidgetContainer
const WidgetContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-4 bg-[#EEEEEE] w-full rounded-2xl shadow">
    <p className="mb-4 font-medium">{title}</p>
    {children}
  </div>
);

// Status Distribution
export const StatusDistributionGraph = () => {
  const { user } = useUserDataStore();
  const { data, isLoading } = useQuery<{ data: { statuses: StatusCount[] } }>({
    queryKey: ["status-counts", user?.deptId],
    queryFn: () => getTicketCountsByStatus(user?.deptId),
    enabled: !!user?.deptId,
  });

  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    const statuses = data?.data?.statuses || [];
    if (!statuses.length) return;

    const labels = statuses.map((s) => s.status);
    const values = statuses.map((s) => s.count);

    setChartData({
      labels,
      datasets: [
        {
          label: "Tickets per status",
          data: values,
          backgroundColor: [
            "#60A5FA",
            "#34D399",
            "#F87171",
            "#FBBF24",
            "#A78BFA",
            "#F472B6",
          ],
        },
      ],
    });
  }, [data]);

  return (
    <WidgetContainer title="Ticket Status Distribution">
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.data?.statuses?.length ? (
        <Chart type="pie" data={chartData} className="h-72" />
      ) : (
        <p>No status data available.</p>
      )}
    </WidgetContainer>
  );
};

// SLA Compliance
export const SLAComplianceGraph = () => {
  const { user } = useUserDataStore();
  const { data, isLoading } = useQuery<{ data: SLACompliance }>({
    queryKey: ["sla-compliance", user?.deptId],
    queryFn: () => getSLAComplianceReport(user?.deptId),
    enabled: !!user?.deptId,
  });

  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    if (!data?.data) return;
    const { met, breached } = data.data;

    setChartData({
      labels: ["Met SLA", "Breached SLA"],
      datasets: [
        {
          label: "SLA Compliance",
          data: [met, breached],
          backgroundColor: ["#34D399", "#F87171"],
        },
      ],
    });
  }, [data]);

  return (
    <WidgetContainer title="SLA Compliance">
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.data ? (
        <Chart type="doughnut" data={chartData} className="h-72" />
      ) : (
        <p>No SLA data available.</p>
      )}
    </WidgetContainer>
  );
};

// Most Active Users
export const MostActiveUsers = () => {
  const { user } = useUserDataStore();
  const { data, isLoading } = useQuery<{ data: { users: MostActiveUser[] } }>({
    queryKey: ["active-users", user?.deptId],
    queryFn: () => getMostActiveUsers(user?.deptId),
    enabled: !!user?.deptId,
  });

  return (
    <WidgetContainer title="Most Active Users">
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.data?.users?.length ? (
        <ul className="space-y-2">
          {data.data.users.map((user, index) => (
            <li key={index} className="flex justify-between">
              <span>{user.name}</span>
              <span className="font-semibold">{user.activities}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No user activity data.</p>
      )}
    </WidgetContainer>
  );
};

// Ticket Engagement Stats
export const TicketEngagementStats = () => {
  const { user } = useUserDataStore();
  const { data, isLoading } = useQuery<{ data: EngagementStats }>({
    queryKey: ["engagement", user?.deptId],
    queryFn: () => getCommentAndReportStats(user?.deptId),
    enabled: !!user?.deptId,
  });

  return (
    <WidgetContainer title="Ticket Engagement">
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.data ? (
        <ul className="space-y-1">
          <li>
            Comments: <strong>{data.data.comments}</strong>
          </li>
          <li>
            Reports: <strong>{data.data.reports}</strong>
          </li>
        </ul>
      ) : (
        <p>No engagement data.</p>
      )}
    </WidgetContainer>
  );
};

// On-Hold Tickets
export const OnHoldTicketsList = () => {
  const { user } = useUserDataStore();
  const { data, isLoading } = useQuery<{ data: { tickets: OnHoldTicket[] } }>({
    queryKey: ["onhold", user?.deptId],
    queryFn: () => getOnHoldTickets(user?.deptId),
    enabled: !!user?.deptId,
  });

  return (
    <WidgetContainer title="On-Hold Tickets">
      {isLoading ? (
        <p>Loading...</p>
      ) : data?.data?.tickets?.length ? (
        <ul className="pr-2 space-y-2 overflow-y-auto max-h-64">
          {data.data.tickets.map((t, index) => (
            <li key={index} className="flex justify-between">
              <span className="w-3/4 truncate" title={t.title}>
                {t.title}
              </span>
              <span className="text-xs text-gray-500">{t.pauseReason}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No on-hold tickets.</p>
      )}
    </WidgetContainer>
  );
};
