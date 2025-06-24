import PageTemplate from "../templates/PageTemplate";

import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import UserTicketsGraph from "../components/UserTicketsGraph";

const DashboardPage = () => {
  return (
    <PageTemplate>
      <div
        className={`w-full h-screen gap-4 p-4 overflow-auto ${scrollbarTheme}`}
      >
        <UserTicketsGraph />
      </div>
    </PageTemplate>
  );
};

export default DashboardPage;
