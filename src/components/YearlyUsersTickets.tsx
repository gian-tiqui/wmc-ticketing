import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Query } from "../types/types";
import { getUsersTcketsPerYear } from "../@utils/services/dashboardService";
import useUserDataStore from "../@utils/store/userDataStore";
import { getAllStatus } from "../@utils/services/statusService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";

const YearlyUsersTickets = () => {
  const [query, setQuery] = useState<Query>({ statusId: 1 });
  const { user } = useUserDataStore();
  const [chartData, setChartData] = useState({});
  const [status, setStatus] = useState(undefined);
  const [chartOptions, setChartOptions] = useState({});
  const [noData, setNoData] = useState<boolean>(false);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Nullable<Date>>(null);

  const { data: yearlyTicketsData } = useQuery({
    queryKey: [`yearly-tickets-${JSON.stringify(query)}-users`],
    queryFn: () => getUsersTcketsPerYear(user?.deptId, query, year),
  });

  const { data: statuses } = useQuery({
    queryKey: [`statuses-dashboard`],
    queryFn: () => getAllStatus({ limit: 20 }),
  });

  useEffect(() => {
    if (!yearlyTicketsData?.data?.yearlyTicketsData) return;

    if (yearlyTicketsData?.data?.yearlyTicketsData.labels.length < 1) {
      setNoData(true);
      return;
    }

    setNoData(false);

    const { labels, dataSet } = yearlyTicketsData.data.yearlyTicketsData;
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
  }, [yearlyTicketsData]);

  if (noData) {
    return (
      <div className="w-[60%] mx-auto mb-6">
        <div className="flex items-center justify-between w-full mb-8">
          <p className="font-medium">User Tickets per year</p>
          <div className="flex gap-2">
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
          </div>
        </div>
        <div className="h-80">
          <p className="font-medium">No data to show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#EEEEEE] w-full rounded-2xl shadow col-span-2">
      <div className="flex items-center justify-between w-full mb-8">
        <p className="font-medium">User Tickets per year</p>
        <div className="flex gap-2">
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
        type="bar"
        data={chartData}
        options={chartOptions}
        className="h-80"
      />
    </div>
  );
};

export default YearlyUsersTickets;
