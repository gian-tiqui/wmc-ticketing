import PageTemplate from "../templates/PageTemplate";
import YearlyDepartmentsGraph from "../components/YearlyDepartmentsGraph";
import MonthlyDepartmentGraph from "../components/MonthlyDepartmentGraph";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import DailyDepartmentGraph from "../components/DailyDepartmentGraph";

const DashboardPage = () => {
  return (
    <PageTemplate>
      <div
        className={`grid w-full h-screen pt-10 overflow-auto ${scrollbarTheme}`}
      >
        <YearlyDepartmentsGraph />
        <MonthlyDepartmentGraph />
        <DailyDepartmentGraph />
      </div>
    </PageTemplate>
  );
};

export default DashboardPage;
