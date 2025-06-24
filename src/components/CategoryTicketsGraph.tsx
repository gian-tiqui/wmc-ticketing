// components/CategoryTicketsGraph.tsx
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { DateRange } from "react-date-range";
import { Popover } from "@headlessui/react";
import { addDays } from "date-fns";
import { getCategoryTicketsByDateRange } from "../@utils/services/dashboardService";
import { getAllStatus } from "../@utils/services/statusService";
import useUserDataStore from "../@utils/store/userDataStore";
import { getDepartmentCategoriesByDeptId } from "../@utils/services/departmentService";

const CategoryTicketsGraph = () => {
  const { user } = useUserDataStore();
  const [status, setStatus] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [query, setQuery] = useState({ groupBy: "day", statusId: 1 });
  const [range, setRange] = useState([
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
        dateFrom: range[0].startDate.toISOString().split("T")[0],
        dateTo: range[0].endDate.toISOString().split("T")[0],
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

  return (
    <div className="p-4 bg-[#EEEEEE] w-full rounded-2xl shadow">
      <div className="flex items-center justify-between w-full mb-8">
        <p className="font-medium">
          Category tickets grouped by {query.groupBy}
        </p>
        <div className="flex items-center gap-2">
          <Popover className="relative">
            <Popover.Button className="px-4 py-2 bg-white border rounded shadow">
              {range[0].startDate.toLocaleDateString()} -{" "}
              {range[0].endDate.toLocaleDateString()}
            </Popover.Button>
            <Popover.Panel className="absolute z-50 mt-2">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setRange([item.selection])}
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
            className="h-10"
            placeholder="Select category"
          />

          <Dropdown
            options={["day", "month", "year"]}
            value={query.groupBy}
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

export default CategoryTicketsGraph;
