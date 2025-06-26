import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { Popover } from "@headlessui/react";
import { addDays } from "date-fns";
import { getCategoryTicketsByDateRange } from "../@utils/services/dashboardService";
import { getAllStatus } from "../@utils/services/statusService";
import useUserDataStore from "../@utils/store/userDataStore";
import { getDepartmentCategoriesByDeptId } from "../@utils/services/departmentService";
import { Category } from "../types/types";

// Define the groupBy type
type GroupByType = "day" | "month" | "year";

const CategoryTicketsGraph = () => {
  const { user } = useUserDataStore();
  const [status, setStatus] = useState();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [query, setQuery] = useState<{
    groupBy: GroupByType;
    statusId: number;
  }>({
    groupBy: "day",
    statusId: 1,
  });
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [noData, setNoData] = useState(false);

  const { data: statuses } = useQuery({
    queryKey: ["statuses-dashboard"],
    queryFn: () => getAllStatus({ limit: 20 }),
  });

  const { data: departmentCategoriesData } = useQuery({
    queryKey: ["department-categories", user?.deptId],
    queryFn: () => getDepartmentCategoriesByDeptId(user?.deptId, { limit: 50 }),
    enabled: !!user?.deptId,
  });

  const { data: ticketsData } = useQuery({
    queryKey: ["category-tickets", selectedCategory?.id, range[0], query],
    queryFn: () =>
      getCategoryTicketsByDateRange(selectedCategory?.id, {
        ...query,
        dateFrom: range[0].startDate?.toISOString().split("T")[0] || "",
        dateTo: range[0].endDate?.toISOString().split("T")[0] || "",
      }),
    enabled:
      !!selectedCategory?.id && !!range[0].startDate && !!range[0].endDate,
  });

  useEffect(() => {
    if (!ticketsData?.data?.ticketsData) return;
    const { labels, dataSets } = ticketsData.data.ticketsData;
    if (!labels || labels.length < 1) return setNoData(true);
    setNoData(false);

    const docStyle = getComputedStyle(document.documentElement);
    const textColor = docStyle.getPropertyValue("--text-color-secondary");
    const borderColor = docStyle.getPropertyValue("--surface-border");

    setChartData({ labels, datasets: dataSets });
    setChartOptions({
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: { legend: { position: "bottom" } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: borderColor } },
        y: { ticks: { color: textColor }, grid: { color: borderColor } },
      },
    });
  }, [ticketsData]);

  const handleDateRangeChange = (item: RangeKeyDict) => {
    const selection = item.selection as Range;
    if (selection.startDate && selection.endDate) {
      setRange([selection]);
    }
  };

  return (
    <div className="p-4 bg-[#EEEEEE] w-full rounded-2xl shadow">
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <Popover className="relative w-full sm:w-40">
          <Popover.Button className="flex items-center w-full h-10 px-3 text-sm text-left bg-white border rounded shadow">
            {range[0].startDate?.toLocaleDateString() || "Start Date"} -{" "}
            {range[0].endDate?.toLocaleDateString() || "End Date"}
          </Popover.Button>
          <Popover.Panel className="absolute z-50 mt-2">
            <DateRange
              editableDateInputs
              onChange={handleDateRangeChange}
              moveRangeOnFirstSelection={false}
              ranges={range}
            />
          </Popover.Panel>
        </Popover>

        <Dropdown
          options={departmentCategoriesData?.data?.categories || []}
          value={selectedCategory}
          optionLabel="name"
          onChange={(e) => setSelectedCategory(e.value)}
          className="w-full h-10 sm:w-40"
          panelClassName="text-sm"
          placeholder="Select category"
        />

        <Dropdown
          options={[
            { label: "Day", value: "day" as GroupByType },
            { label: "Month", value: "month" as GroupByType },
            { label: "Year", value: "year" as GroupByType },
          ]}
          value={query.groupBy}
          optionLabel="label"
          optionValue="value"
          onChange={(e) => setQuery((prev) => ({ ...prev, groupBy: e.value }))}
          className="w-full h-10 sm:w-40"
          panelClassName="text-sm"
          placeholder="Group by"
        />

        <Dropdown
          options={statuses?.data?.statuses}
          optionLabel="type"
          value={status}
          onChange={(e) => {
            setStatus(e.value);
            setQuery((prev) => ({ ...prev, statusId: e.value.id }));
          }}
          className="w-full h-10 sm:w-40"
          panelClassName="text-sm"
          placeholder="Status"
        />
      </div>

      {noData ? (
        <div className="flex items-center justify-center h-80">
          <p className="text-sm text-gray-600">No data to show</p>
        </div>
      ) : (
        <div className="h-[400px] w-full">
          <Chart
            type="line"
            data={chartData}
            options={chartOptions}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default CategoryTicketsGraph;
