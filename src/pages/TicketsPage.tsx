import { TabPanel, TabView } from "primereact/tabview";
import PageTemplate from "../templates/PageTemplate";
import useCrmSidebarStore from "../@utils/store/crmSidebar";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import NewTicketButton from "../components/NewTicketButton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Query } from "../types/types";
import { getTickets } from "../@utils/services/ticketService";
import TicketsTable from "../components/TicketsTable";

const TicketsPage = () => {
  const { isExpanded } = useCrmSidebarStore();
  const [query] = useState<Query>({ search: "" });
  const { data: newTicketsData } = useQuery({
    queryKey: [`new-tickets-${JSON.stringify({ ...query, statusId: 1 })}`],
    queryFn: () => getTickets({ ...query, statusId: 1 }),
  });

  return (
    <PageTemplate>
      <div className="w-full h-full p-4 bg-inherit">
        <div className="flex items-center justify-between mb-10">
          <h4 className={` text-2xl font-medium ${!isExpanded && "ms-14"} `}>
            <i className={`${PrimeIcons.TICKET} text-xl rotate-90`}></i> Tickets
          </h4>
          <NewTicketButton />
        </div>

        <TabView
          pt={{
            panelContainer: {
              className: "h-[73vh] w-full bg-inherit",
            },
            nav: { className: "w-full bg-inherit" },
            tab: { className: "w-full bg-inherit" },
          }}
        >
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.PLUS} me-2`}
            header={
              <div className="flex items-center">
                <p>New</p>
                <Avatar
                  label={newTicketsData?.data.count}
                  shape="circle"
                  className="w-6 h-6 text-white bg-blue-400 ms-2"
                />
              </div>
            }
          >
            <TicketsTable tickets={newTicketsData?.data.tickets} />
          </TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.EYE} me-2`}
            header={
              <div className="flex items-center">
                <p>Viewed</p>
                <Avatar
                  label="0"
                  shape="circle"
                  className="w-6 h-6 text-white bg-blue-400 ms-2"
                />
              </div>
            }
          ></TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.USER_PLUS} me-2`}
            header={
              <div className="flex items-center">
                <p>Assigned</p>
                <Avatar
                  label="0"
                  shape="circle"
                  className="w-6 h-6 text-white bg-blue-400 ms-2"
                />
              </div>
            }
          ></TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.ALIGN_CENTER} me-2`}
            header={
              <div className="flex items-center">
                <p>Acknowledged</p>
                <Avatar
                  label="0"
                  shape="circle"
                  className="w-6 h-6 text-white bg-blue-400 ms-2"
                />
              </div>
            }
          ></TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.CHECK_CIRCLE} me-2`}
            header={
              <div className="flex items-center">
                <p>Resolved</p>
                <Avatar
                  label="0"
                  shape="circle"
                  className="w-6 h-6 text-white bg-blue-400 ms-2"
                />
              </div>
            }
          ></TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.LIST} me-2`}
            header={
              <div className="flex items-center">
                <p>Closed</p>
                <Avatar
                  label="0"
                  shape="circle"
                  className="w-6 h-6 text-white bg-blue-400 ms-2"
                />
              </div>
            }
          ></TabPanel>
        </TabView>
      </div>
    </PageTemplate>
  );
};

export default TicketsPage;
