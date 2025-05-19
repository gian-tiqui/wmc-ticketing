import CrmSidebarFooter from "./CrmSidebarFooter";
import CrmSidebarHeader from "./CrmSidebarHeader";
import CrmSidebarSection from "./CrmSidebarSection";

const CrmAside = () => {
  return (
    <aside className="relative flex flex-col h-screen py-5 w-80 bg-[#EEEEEE]">
      <CrmSidebarHeader />
      <CrmSidebarSection />
      <hr className="mx-5 mb-3 border-gray-300 border-b/1" />
      <CrmSidebarFooter />
    </aside>
  );
};

export default CrmAside;
