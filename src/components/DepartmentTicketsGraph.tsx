// components/DepartmentTicketsGraph.tsx
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { Popover } from "@headlessui/react";
import { addDays } from "date-fns";
import { getDepartmentTicketsByDateRange } from "../@utils/services/dashboardService";
import { getAllStatus } from "../@utils/services/statusService";
import useUserDataStore from "../@utils/store/userDataStore";

// Define the groupBy type
type GroupByType = "day" | "month" | "year";

const DepartmentTicketsGraph = () => {
  const { user } = useUserDataStore();
  const [status, setStatus] = useState();
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

  const { data: ticketsData } = useQuery({
    queryKey: ["dept-tickets", user?.deptId, range[0], query],
    queryFn: () =>
      getDepartmentTicketsByDateRange(user?.deptId, {
        ...query,
        dateFrom: range[0].startDate?.toISOString().split("T")[0] || "",
        dateTo: range[0].endDate?.toISOString().split("T")[0] || "",
      }),
    enabled: !!user?.deptId && !!range[0].startDate && !!range[0].endDate,
  });

  useEffect(() => {
    console.log(ticketsData);
  }, [ticketsData]);

  useEffect(() => {
    if (!ticketsData?.data?.ticketsData) return;
    const { labels, dataSet, dataSets } = ticketsData.data.ticketsData;

    // ADD DEBUG LOGGING
    console.log("=== DEBUG: Chart Data ===");
    console.log("Group By:", query.groupBy);
    console.log("Labels:", labels);
    console.log("DataSet (singular):", dataSet);
    console.log("DataSets (plural):", dataSets);
    console.log("Labels length:", labels?.length);
    console.log("Full ticketsData:", ticketsData.data.ticketsData);
    console.log("========================");

    // Handle both dataSet (singular) and dataSets (plural) from backend
    const datasets = dataSets || (dataSet ? [dataSet] : []);

    if (!labels || labels.length < 1 || !datasets || datasets.length < 1) {
      return setNoData(true);
    }
    setNoData(false);

    const docStyle = getComputedStyle(document.documentElement);
    const textColor = docStyle.getPropertyValue("--text-color-secondary");
    const borderColor = docStyle.getPropertyValue("--surface-border");

    // Enhanced chart options for better line visibility
    let enhancedDataSets =
      datasets?.map((dataset: any) => ({
        ...dataset,
        type: "line", // Force line type
        tension: 0.4, // Smooth lines
        borderWidth: 3, // Thicker lines
        pointRadius: 6, // Larger points
        pointHoverRadius: 8,
        fill: false, // Ensure no fill for line chart
        showLine: true, // Explicitly show line
        borderColor: dataset.borderColor || "#3B82F6", // Default color if not provided
        backgroundColor: dataset.backgroundColor || "#3B82F6",
      })) || [];

    setChartData({ labels, datasets: enhancedDataSets });
    setChartOptions({
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: borderColor },
          type: query.groupBy === "year" ? "linear" : "category", // Different scale for years
        },
        y: {
          ticks: { color: textColor },
          grid: { color: borderColor },
          beginAtZero: true,
        },
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6,
        },
        line: {
          borderWidth: 2,
          tension: 0.4,
        },
      },
    });
  }, [ticketsData, query.groupBy]);

  // Helper function to handle date range changes safely
  const handleDateRangeChange = (item: RangeKeyDict) => {
    const selection = item.selection;
    if (selection.startDate && selection.endDate) {
      setRange([selection]);
    }
  };

  return (
    <div className="p-4 bg-[#EEEEEE] w-full rounded-2xl shadow">
      <div className="flex items-center justify-between w-full mb-8">
        <p className="font-medium">
          Department tickets grouped by {query.groupBy}
        </p>
        <div className="flex items-center gap-2">
          <Popover className="relative">
            <Popover.Button className="px-4 py-2 bg-white border rounded shadow">
              {range[0].startDate?.toLocaleDateString() || "Start Date"} -{" "}
              {range[0].endDate?.toLocaleDateString() || "End Date"}
            </Popover.Button>
            <Popover.Panel className="absolute z-50 mt-2">
              <DateRange
                editableDateInputs={true}
                onChange={handleDateRangeChange}
                moveRangeOnFirstSelection={false}
                ranges={range}
              />
            </Popover.Panel>
          </Popover>

          <Dropdown
            options={[
              { label: "Day", value: "day" as GroupByType },
              { label: "Month", value: "month" as GroupByType },
              { label: "Year", value: "year" as GroupByType },
            ]}
            value={query.groupBy}
            optionLabel="label"
            optionValue="value"
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, groupBy: e.value }))
            }
            className="h-10"
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
            className="h-10"
            placeholder="Status"
          />
        </div>
      </div>
      {noData ? (
        <div className="flex items-center justify-center h-80">
          <p>No data to show</p>
        </div>
      ) : (
        <Chart
          type="line"
          data={chartData}
          options={chartOptions}
          className="h-80"
        />
      )}
    </div>
  );
};

export default DepartmentTicketsGraph;
