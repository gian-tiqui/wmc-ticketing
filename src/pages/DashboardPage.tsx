import PageTemplate from "../templates/PageTemplate";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import UserTicketsGraph from "../components/UserTicketsGraph";
import DepartmentTicketsGraph from "../components/DepartmentTicketsGraph";
import CategoryTicketsGraph from "../components/CategoryTicketsGraph";
import {
  StatusDistributionGraph,
  SLAComplianceGraph,
  MostActiveUsers,
  TicketEngagementStats,
  OnHoldTicketsList,
} from "../components/DashboardWidgets";

const DashboardPage = () => {
  return (
    <PageTemplate>
      <div className={`w-full h-screen p-6 overflow-auto ${scrollbarTheme}`}>
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">
          Dashboard Overview
        </h1>

        {/* Main Graphs Section */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          <UserTicketsGraph />
          <DepartmentTicketsGraph />
        </div>

        <CategoryTicketsGraph />

        <br />

        {/* Analytics & Stats Widgets */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          <StatusDistributionGraph />
          <SLAComplianceGraph />
          <MostActiveUsers />
        </div>

        {/* Engagement & On-Hold */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TicketEngagementStats />
          <OnHoldTicketsList />
        </div>
      </div>
    </PageTemplate>
  );
};

export default DashboardPage;
