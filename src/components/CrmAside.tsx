import CrmSidebarUserSection from "./CrmAsideUserSection";
import CrmSidebarSection from "./CrmSidebarSection";

const CrmAside = () => {
  return (
    <aside className="relative flex flex-col h-screen w-64 border-r shadow border-blue-600/30 bg-[#EEEEEE]/80 backdrop-blur">
      <CrmSidebarSection />
      <hr className="mb-3 shadow border-blue-600/30 border-b/1" />
      <CrmSidebarUserSection />
    </aside>
  );
};

export default CrmAside;
