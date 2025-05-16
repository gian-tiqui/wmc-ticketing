import PageTemplate from "../templates/PageTemplate";
import YearlyDepartmentsGraph from "../components/YearlyDepartmentsGraph";
import MonthlyDepartmentGraph from "../components/MonthlyDepartmentGraph";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import DailyDepartmentGraph from "../components/DailyDepartmentGraph";
import YearlyCategoriesGraph from "../components/YearlyCategoriesGraph";
import MonthlyCategoriesGraph from "../components/MonthlyCategoriesGraph";
import DailyCategoriesGraph from "../components/DailyCategoriesGraph";
import YearlyUsersTickets from "../components/YearlyUsersTickets";

const DashboardPage = () => {
  return (
    <PageTemplate>
      <div
        className={`grid w-full h-screen pt-10 overflow-auto ${scrollbarTheme}`}
      >
        <YearlyDepartmentsGraph />
        <MonthlyDepartmentGraph />
        <DailyDepartmentGraph />
        <YearlyCategoriesGraph />
        <MonthlyCategoriesGraph />
        <DailyCategoriesGraph />
        <YearlyUsersTickets />
      </div>
    </PageTemplate>
  );
};

export default DashboardPage;
