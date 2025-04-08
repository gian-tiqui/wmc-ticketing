import PageTemplate from "../templates/PageTemplate";
import YearlyDepartmentsGraph from "../components/YearlyDepartmentsGraph";
import MonthlyDepartmentGraph from "../components/MonthlyDepartmentGraph";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";

const DashboardPage = () => {
  return (
    <PageTemplate>
      <div
        className={`grid w-full h-screen pt-10 overflow-auto ${scrollbarTheme}`}
      >
        <YearlyDepartmentsGraph />
        <MonthlyDepartmentGraph />
      </div>
    </PageTemplate>
  );
};

export default DashboardPage;
