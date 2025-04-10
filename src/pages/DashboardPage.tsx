import PageTemplate from "../templates/PageTemplate";
import YearlyDepartmentsGraph from "../components/YearlyDepartmentsGraph";
import MonthlyDepartmentGraph from "../components/MonthlyDepartmentGraph";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import DailyDepartmentGraph from "../components/DailyDepartmentGraph";
import YearlyCategoriesGraph from "../components/YearlyCategoriesGraph";

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
      </div>
    </PageTemplate>
  );
};

export default DashboardPage;
