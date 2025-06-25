import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import useUserDataStore from "../@utils/store/userDataStore";
import { getUsersTicketsPerDateRange } from "../@utils/services/dashboardService";
import { getAllStatus } from "../@utils/services/statusService";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Popover } from "@headlessui/react";
import { addDays } from "date-fns";

// Define status type (adjust this based on your actual status object structure)
type StatusType = {
  id: number;
  type: string;
  // Add other properties as needed
};

// Define the groupBy type
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

  const { data: statuses } = useQuery({
    queryKey: ["statuses-dashboard"],
    queryFn: () => getAllStatus({ limit: 20 }),
  });

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
          User ticket counts grouped by {query.groupBy}
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
          type="bar"
          data={chartData}
          options={chartOptions}
          className="h-80"
        />
      )}
    </div>
  );
};

export default UserTicketsGraph;
