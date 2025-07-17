import React, { ReactNode } from "react";
import useLoggedInStore from "../@utils/store/loggedIn";
import PageTemplate from "../templates/PageTemplate";
import CrmAside from "./CrmAside";
import useCrmSidebarStore from "../@utils/store/crmSidebar";
import CrmAsideButtonToggler from "./CrmAsideButtonToggler";

interface Props {
  children?: ReactNode;
}

const CrmSidebar: React.FC<Props> = ({ children }) => {
  const { isLoggedIn } = useLoggedInStore();
  const { isExpanded } = useCrmSidebarStore();

  if (!isLoggedIn) return children;

  return (
    <PageTemplate>
      <div className="relative flex bg-inherit">
        {isExpanded === false && (
          <div className="absolute z-50 top-4 left-4">
            <CrmAsideButtonToggler />
          </div>
        )}
        <div className="absolute z-50 md:relative">
          {isExpanded && <CrmAside />}
        </div>
        <main className="w-full">{children}</main>
      </div>
    </PageTemplate>
  );
};

export default CrmSidebar;
