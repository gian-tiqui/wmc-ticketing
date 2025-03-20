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
      className={`w-10 h-10`}
    ></Button>
  );
};

export default CrmAsideButtonToggler;
