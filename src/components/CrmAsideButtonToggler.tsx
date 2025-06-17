import { PrimeIcons } from "primereact/api";
import useCrmSidebarStore from "../@utils/store/crmSidebar";
import { Button } from "primereact/button";

const CrmAsideButtonToggler = () => {
  const { isExpanded, setIsExpanded } = useCrmSidebarStore();

  return (
    <Button
      onClick={() => setIsExpanded(!isExpanded)}
      icon={`${PrimeIcons.BARS} `}
      severity="contrast"
      className={`w-7 h-7 bg-blue-600/50 backdrop-blur hover:bg-blue-600 border-none`}
    ></Button>
  );
};

export default CrmAsideButtonToggler;
