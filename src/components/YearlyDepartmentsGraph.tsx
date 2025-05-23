import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Query } from "../types/types";
import { getDepartmentTicketsPerYear } from "../@utils/services/dashboardService";
import useUserDataStore from "../@utils/store/userDataStore";
import { getAllStatus } from "../@utils/services/statusService";
import { Dropdown } from "primereact/dropdown";

const YearlyDepartmentsGraph = () => {
  const [query, setQuery] = useState<Query>({ statusId: 1 });
  const { user } = useUserDataStore();
  const [chartData, setChartData] = useState({});
  const [status, setStatus] = useState(undefined);
  const [chartOptions, setChartOptions] = useState({});
  const [noData, setNoData] = useState<boolean>(false);

  const { data: yearlyTicketsData } = useQuery({
    queryKey: [`yearly-tickets-${JSON.stringify(query)}`],
    queryFn: () => getDepartmentTicketsPerYear(user?.deptId, query),
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
      <div className="p-4 rounded-3xl bg-[#EEEEEE] w-full">
        <div className="flex items-center justify-between w-full mb-8">
          <p className="text-sm font-medium text-blue-600">
            Department Tickets per year
          </p>
          <Dropdown
            pt={{
              header: { className: "bg-[#eeeeee] text-xs" },
              filterInput: { className: "bg-inherit text-xs" },
              list: { className: `bg-[#eeeeee] text-xs` },
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
          Department Tickets per year
        </p>
        <Dropdown
          pt={{
            header: { className: "bg-[#eeeeee] text-xs" },
            filterInput: { className: "bg-inherit text-xs" },
            list: { className: `bg-[#eeeeee] text-xs` },
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

      <Chart
        type="line"
        data={chartData}
        options={chartOptions}
        className="h-80"
      />
    </div>
  );
};

export default YearlyDepartmentsGraph;
