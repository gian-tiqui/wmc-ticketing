import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Query } from "../types/types";
import { getDepartmentTicketsPerDay } from "../@utils/services/dashboardService";
import useUserDataStore from "../@utils/store/userDataStore";
import { getAllStatus } from "../@utils/services/statusService";
import { Dropdown } from "primereact/dropdown";
import { Nullable } from "primereact/ts-helpers";
import { Calendar } from "primereact/calendar";

const DailyDepartmentGraph = () => {
  const [query, setQuery] = useState<Query>({ statusId: 1 });
  const initialDate = new Date();
  const [date, setDate] = useState<Nullable<Date>>(initialDate);
  const [month, setMonth] = useState<number | undefined>(
    initialDate.getMonth() + 1
  );
  const [year, setYear] = useState<number | undefined>(
    initialDate.getFullYear()
  );
  const { user } = useUserDataStore();
  const [chartData, setChartData] = useState({});
  const [status, setStatus] = useState(undefined);
  const [chartOptions, setChartOptions] = useState({});
  const [noData, setNoData] = useState<boolean>(false);
  const [, setMonthName] = useState<string>("");

  const { data: dailyTicketsData } = useQuery({
    queryKey: [`daily-tickets-${JSON.stringify(query)}-${year}-${month}`],
    queryFn: () => getDepartmentTicketsPerDay(user?.deptId, year, month, query),
  });

  const { data: statuses } = useQuery({
    queryKey: [`statuses-dashboard`],
    queryFn: () => getAllStatus({ limit: 20 }),
  });

  useEffect(() => {
    if (month && year) {
      const monthName = new Date(year, month);

      setMonthName(
        monthName?.toLocaleDateString("default", { month: "short" })
      );
    }
  }, [month, year, date]);

  useEffect(() => {
    if (!dailyTicketsData?.data?.dailyTicketsData) return;

    if (dailyTicketsData?.data?.dailyTicketsData.labels.length < 1) {
      setNoData(true);
      return;
    }

    setNoData(false);

    const { labels, dataSet } = dailyTicketsData.data.dailyTicketsData;
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
  }, [dailyTicketsData]);

  if (noData) {
    return (
      <div className="w-full mx-auto rounded-3xl p-4 bg-[#EEEEEE] ">
        <div className="flex items-center justify-between w-full mb-8">
          <p className="text-sm font-medium text-blue-600">
            Department Tickets per day
          </p>

          <div className="flex gap-4">
            <Calendar
              className="w-24 h-8"
              value={date}
              view="month"
              dateFormat="mm/yy"
              onChange={(e) => {
                const m = e.value?.getMonth();
                setDate(e.value);
                setMonth(m !== undefined ? m + 1 : undefined);
                setYear(e.value?.getFullYear());
              }}
            />

            <Dropdown
              pt={{
                header: { className: "text-xs" },
                filterInput: { className: "bg-inherit text-xs" },
                list: { className: `text-xs` },
                item: {
                  className: "text-xs",
                },
                input: { className: "text-xs" },
              }}
              options={statuses?.data.statuses}
              optionLabel="type"
              value={status}
              className="items-center h-8 bg-white border-black"
              placeholder="Select a status"
              onChange={(e) => {
                setStatus(e.value);
                setQuery((prev) => ({ ...prev, statusId: e.value.id }));
              }}
            />
          </div>
        </div>
        <div className="h-80">
          <p className="font-medium">No data to show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#EEEEEE] w-full rounded-2xl shadow">
      <div className="flex items-center justify-between w-full mb-8">
        <p className="text-sm font-medium text-blue-600">
          Department Tickets per day
        </p>
        <div className="flex gap-4">
          <Calendar
            className="w-24 h-8"
            value={date}
            view="month"
            dateFormat="mm/yy"
            onChange={(e) => {
              const m = e.value?.getMonth();
              setDate(e.value);
              setMonth(m !== undefined ? m + 1 : undefined);
              setYear(e.value?.getFullYear());
            }}
          />

          <Dropdown
            pt={{
              header: { className: "text-xs" },
              filterInput: { className: "bg-inherit text-xs" },
              list: { className: `text-xs` },
              item: {
                className: "text-xs",
              },
              input: { className: "text-xs" },
            }}
            options={statuses?.data.statuses}
            optionLabel="type"
            value={status}
            className="items-center h-8 bg-white border-black"
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
