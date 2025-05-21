import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Category, Query } from "../types/types";
import { getCategoriesTicketsPerYear } from "../@utils/services/dashboardService";
import useUserDataStore from "../@utils/store/userDataStore";
import { getAllStatus } from "../@utils/services/statusService";
import { Dropdown } from "primereact/dropdown";
import { getDepartmentCategoriesByDeptId } from "../@utils/services/departmentService";

const YearlyCategoriesGraph = () => {
  const [query, setQuery] = useState<Query>({ statusId: 1 });
  const { user } = useUserDataStore();
  const [chartData, setChartData] = useState({});
  const [status, setStatus] = useState(undefined);
  const [chartOptions, setChartOptions] = useState({});
  const [noData, setNoData] = useState<boolean>(false);
  const [categoryQuery] = useState<Query>({ search: "", offset: 0, limit: 50 });
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const { data: departmentCategoriesData } = useQuery({
    queryKey: [
      `department-${user?.deptId}-categories-${JSON.stringify(categoryQuery)}`,
    ],
    queryFn: () => getDepartmentCategoriesByDeptId(user?.deptId, query),
    enabled: !!user,
  });

  const { data: yearlyTicketsData } = useQuery({
    queryKey: [
      `categories-yearly-tickets-${JSON.stringify(query)}-${user?.deptId}-${
        selectedCategory?.id
      }`,
    ],
    queryFn: () => getCategoriesTicketsPerYear(selectedCategory?.id, query),
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
          <p className="font-medium">Categories tickets per year</p>
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

            <Dropdown
              id="categoriesDropdown"
              pt={{
                header: { className: "bg-slate-800" },
                filterInput: { className: "bg-inherit text-slate-100" },
                list: { className: "bg-slate-800" },
                item: {
                  className:
                    "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
                },
                input: { className: "text-slate-100" },
              }}
              options={departmentCategoriesData?.data.categories}
              value={selectedCategory}
              optionLabel="name"
              onChange={(e) => {
                setSelectedCategory(e.value);
              }}
              filter
              disabled={
                user && departmentCategoriesData?.data.categories.length === 0
              }
              className={`w-52 bg-inherit border-slate-400 h-10 items-center`}
              placeholder="Select a category"
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
        <p className="font-medium">Categories tickets per year</p>
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

          <Dropdown
            id="categoriesDropdown"
            pt={{
              header: { className: "bg-slate-800" },
              filterInput: { className: "bg-inherit text-slate-100" },
              list: { className: "bg-slate-800" },
              item: {
                className:
                  "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
              },
              input: { className: "text-slate-100" },
            }}
            options={departmentCategoriesData?.data.categories}
            value={selectedCategory}
            optionLabel="name"
            onChange={(e) => {
              setSelectedCategory(e.value);
            }}
            filter
            disabled={
              user && departmentCategoriesData?.data.categories.length === 0
            }
            className={`w-52 bg-inherit border-slate-400 h-10 items-center`}
            placeholder="Select a category"
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

export default YearlyCategoriesGraph;
