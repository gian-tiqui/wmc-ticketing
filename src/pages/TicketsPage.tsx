import { TabPanel, TabView } from "primereact/tabview";
import PageTemplate from "../templates/PageTemplate";
import useCrmSidebarStore from "../@utils/store/crmSidebar";
import { PrimeIcons } from "primereact/api";

const TicketsPage = () => {
  const { isExpanded } = useCrmSidebarStore();

  return (
    <PageTemplate>
      <div className="w-full h-full p-4 bg-inherit">
        <h4 className={`mb-10 text-2xl font-medium ${!isExpanded && "ms-14"} `}>
          <i className={`${PrimeIcons.TICKET} text-xl rotate-90`}></i> Tickets
        </h4>
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
            header="New"
          ></TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.EYE} me-2`}
            header="Viewed"
          ></TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.USER_PLUS} me-2`}
            header="Assigned"
          ></TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.ALIGN_CENTER} me-2`}
            header="Acknowledged"
          ></TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.CHECK_CIRCLE} me-2`}
            header="Resolved"
          ></TabPanel>
          <TabPanel
            pt={{ headerAction: { className: "bg-inherit" } }}
            leftIcon={`${PrimeIcons.LIST} me-2`}
            header="Closed-Resolved"
          ></TabPanel>
        </TabView>
      </div>
    </PageTemplate>
  );
};

export default TicketsPage;
