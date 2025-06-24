import PageTemplate from "../templates/PageTemplate";

import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import UserTicketsGraph from "../components/UserTicketsGraph";
import DepartmentTicketsGraph from "../components/DepartmentTicketsGraph";
import CategoryTicketsGraph from "../components/CategoryTicketsGraph";

const DashboardPage = () => {
  return (
    <PageTemplate>
      <div
        className={`w-full h-screen gap-4 p-4 overflow-auto ${scrollbarTheme}`}
      >
        <UserTicketsGraph />
        <DepartmentTicketsGraph />
        <CategoryTicketsGraph />
      </div>
    </PageTemplate>
  );
};

export default DashboardPage;
