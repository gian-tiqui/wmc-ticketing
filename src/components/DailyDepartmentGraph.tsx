import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Query } from "../types/types";
import { getDepartmentTicketsPerMonth } from "../@utils/services/dashboardService";
import useUserDataStore from "../@utils/store/userDataStore";
import { getAllStatus } from "../@utils/services/statusService";
import { Dropdown } from "primereact/dropdown";
import { Nullable } from "primereact/ts-helpers";
import { Calendar } from "primereact/calendar";

const DailyDepartmentGraph = () => {
  const [query, setQuery] = useState<Query>({ statusId: 1 });
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [year, setYear] = useState<number | undefined>(
    new Date().getFullYear()
  );
  const { user } = useUserDataStore();
  const [chartData, setChartData] = useState({});
  const [status, setStatus] = useState(undefined);
  const [chartOptions, setChartOptions] = useState({});
  const [noData, setNoData] = useState<boolean>(false);

  const { data: monthlyTicketsData } = useQuery({
    queryKey: [`daily-tickets-${JSON.stringify(query)}-${year}`],
    queryFn: () => getDepartmentTicketsPerMonth(user?.deptId, year, query),
  });

  const { data: statuses } = useQuery({
    queryKey: [`statuses-dashboard`],
    queryFn: () => getAllStatus({ limit: 20 }),
  });

  useEffect(() => {
    if (!monthlyTicketsData?.data?.monthlyTicketsData) return;

    if (monthlyTicketsData?.data?.monthlyTicketsData.labels.length < 1) {
      setNoData(true);
      return;
    }

    setNoData(false);

    const { labels, dataSet } = monthlyTicketsData.data.monthlyTicketsData;
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    setChartData({
      labels,
      datasets: [
        {
          ...dataSet,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
        },
      ],
    });

    setChartOptions({
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    });
  }, [monthlyTicketsData]);

  if (noData) {
    return (
      <div className="w-[80%] mx-auto">
        <Dropdown
          options={statuses?.data.statuses}
          optionLabel="type"
          value={status}
          className="mb-6 bg-inherit text-slate-100"
          placeholder="Select a status"
          onChange={(e) => {
            setStatus(e.value);
            setQuery((prev) => ({ ...prev, statusId: e.value.id }));
          }}
        />
        no data
      </div>
    );
  }

  return (
    <div className="w-[60%] mx-auto mb-6">
      <div className="flex items-center justify-between w-full mb-8">
        <p className="font-medium">Department Tickets per month ({year})</p>
        <div className="flex gap-4">
          <Calendar
            className="w-16 h-10"
            value={date}
            view="year"
            dateFormat="yy"
            onChange={(e) => {
              setDate(e.value);
              setYear(e.value?.getFullYear());
            }}
          />
          <Dropdown
            pt={{
              header: { className: "bg-slate-800" },
              filterInput: { className: "bg-inherit text-slate-100" },
              list: { className: `bg-slate-800` },
              item: {
                className:
                  "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
              },
              input: { className: "text-slate-100" },
            }}
            options={statuses?.data.statuses}
            optionLabel="type"
            value={status}
            className="items-center h-10 bg-inherit"
            placeholder="Select a status"
            onChange={(e) => {
              setStatus(e.value);
              setQuery((prev) => ({ ...prev, statusId: e.value.id }));
            }}
          />
        </div>
      </div>

      <Chart
        type="line"
        data={chartData}
        options={chartOptions}
        className="h-80"
      />
    </div>
  );
};

export default DailyDepartmentGraph;
