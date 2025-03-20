import CrmSidebarFooter from "./CrmSidebarFooter";
import CrmSidebarHeader from "./CrmSidebarHeader";
import CrmSidebarSection from "./CrmSidebarSection";

const CrmAside = () => {
  return (
    <aside className="relative flex flex-col h-screen py-5 border-r rounded-e-3xl border-slate-700 w-80 bg-slate-900">
      <CrmSidebarHeader />
      <CrmSidebarSection />
      <hr className="mx-5 mb-3 border-b border-slate-700" />
      <CrmSidebarFooter />
    </aside>
  );
};

export default CrmAside;
