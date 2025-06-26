import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import useUserDataStore from "../@utils/store/userDataStore";
import { getUsersTicketsPerDateRange } from "../@utils/services/dashboardService";
import { getAllStatus } from "../@utils/services/statusService";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { Popover } from "@headlessui/react";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Types
type StatusType = {
  id: number;
  type: string;
};

type GroupByType = "day" | "month" | "year";

const UserTicketsGraph = () => {
  const { user } = useUserDataStore();
  const [status, setStatus] = useState<StatusType | undefined>();
  const [query, setQuery] = useState<{ groupBy: GroupByType }>({
    groupBy: "day",
  });
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [noData, setNoData] = useState(false);
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  // Fetch statuses
  const { data: statuses } = useQuery({
    queryKey: ["statuses-dashboard"],
    queryFn: () => getAllStatus({ limit: 20 }),
  });

  // Fetch ticket data
  const { data: userTicketsData } = useQuery({
    queryKey: [
      "user-tickets-flat",
      user?.deptId,
      range[0].startDate,
      range[0].endDate,
      status?.id,
      query.groupBy,
    ],
    queryFn: () =>
      getUsersTicketsPerDateRange(user?.deptId, {
        statusId: status?.id,
        dateFrom: range[0].startDate?.toISOString().split("T")[0] || "",
        dateTo: range[0].endDate?.toISOString().split("T")[0] || "",
        groupBy: query.groupBy,
      }),
    enabled: !!user?.deptId && !!range[0].startDate && !!range[0].endDate,
  });

  // Handle chart updates
  useEffect(() => {
    if (!userTicketsData?.data?.ticketsData) return;
    const { labels, dataSets } = userTicketsData.data.ticketsData;
    if (!labels || labels.length < 1) return setNoData(true);
    setNoData(false);

    const style = getComputedStyle(document.documentElement);
    const textColor = style.getPropertyValue("--text-color-secondary");
    const borderColor = style.getPropertyValue("--surface-border");

    setChartData({ labels, datasets: dataSets });
    setChartOptions({
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: borderColor } },
        y: { ticks: { color: textColor }, grid: { color: borderColor } },
      },
    });
  }, [userTicketsData]);

  const handleDateRangeChange = (item: RangeKeyDict) => {
    const selection = item.selection;
    if (selection.startDate && selection.endDate) {
      setRange([selection]);
    }
  };

  return (
    <div className="p-4 bg-[#EEEEEE] w-full rounded-2xl shadow">
      <div className="flex flex-col gap-4 mb-6">
        <p className="text-lg font-medium text-gray-800">
          User ticket counts grouped by {query.groupBy}
        </p>

        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <Popover className="relative w-full sm:w-auto">
            <Popover.Button className="w-full px-4 py-2 text-sm text-left bg-white border rounded shadow sm:w-auto">
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
            className="items-center w-full h-10 sm:w-40"
            placeholder="Group by"
          />

          <Dropdown
            options={statuses?.data?.statuses}
            optionLabel="type"
            value={status}
            onChange={(e) => setStatus(e.value)}
            className="items-center w-full h-10 sm:w-40"
            placeholder="Status"
          />
        </div>
      </div>

      {noData ? (
        <div className="flex items-center justify-center h-80">
          <p className="text-sm text-gray-600">No data to show</p>
        </div>
      ) : (
        <div className="h-[400px] w-full">
          <Chart
            type="bar"
            data={chartData}
            options={chartOptions}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default UserTicketsGraph;
