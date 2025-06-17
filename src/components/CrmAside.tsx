import CrmSidebarFooter from "./CrmSidebarFooter";
import CrmSidebarHeader from "./CrmSidebarHeader";
import CrmSidebarSection from "./CrmSidebarSection";

const CrmAside = () => {
  return (
    <aside className="relative flex flex-col h-screen py-3 w-64 border-r shadow border-blue-600/30 bg-[#EEEEEE]/80 backdrop-blur">
      <CrmSidebarHeader />
      <CrmSidebarSection />
      <hr className="mb-3 shadow border-blue-600/30 border-b/1" />
      <CrmSidebarFooter />
    </aside>
  );
};

export default CrmAside;
