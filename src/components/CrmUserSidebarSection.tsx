import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { ButtonType } from "../types/types";
import { useLocation, useNavigate } from "react-router-dom";
import useSelectedButtonStore from "../@utils/store/selectedButton";
import useUserDataStore from "../@utils/store/userDataStore";
import isAuthorized from "../@utils/functions/isAuthorized"; // Import authorization function
import { useEffect } from "react";

const CrmUserSidebarSection = () => {
  const navigate = useNavigate();
  const { user } = useUserDataStore();
  const { id, setId } = useSelectedButtonStore();
  const location = useLocation();

  useEffect(() => {
    const currentLocation = location.pathname.split("/")[1];

    if (currentLocation) setId(currentLocation);
  }, [location, setId]);

  const allButtons: (ButtonType & { allowedRoles: string[] })[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: "pi pi-wave-pulse",
      path: "/dashboard",
      allowedRoles: ["admin"],
    },
    {
      id: "ticket",
      name: "Tickets",
      icon: PrimeIcons.TICKET,
      path: "/ticket",
      allowedRoles: ["user", "admin"],
    },
    {
      id: "users",
      name: "Users",
      icon: PrimeIcons.USERS,
      path: "/users",
      allowedRoles: ["admin"],
    },
    {
      id: "departments",
      name: "Departments",
      icon: PrimeIcons.BUILDING,
      path: "/departments",
      allowedRoles: ["admin"],
    },
    {
      id: "categories",
      name: "Categories",
      icon: PrimeIcons.ALIGN_CENTER,
      path: "/categories",
      allowedRoles: ["admin", "user"],
    },
    {
      id: "reports",
      name: "Reports",
      icon: "pi pi-wave-pulse",
      path: "/reports",
      allowedRoles: ["admin", "user"],
    },
    {
      id: "knowledgebase",
      name: "Knowledgebase",
      icon: PrimeIcons.CHEVRON_CIRCLE_LEFT,
      path: "/knowledgebase",
      allowedRoles: ["admin", "user"],
    },
  ];

  const buttons: ButtonType[] = allButtons.filter((button) =>
    isAuthorized(user, button.allowedRoles)
  );

  return (
    <section className="flex-1 overflow-hidden">
      <small className="mx-3 font-medium">Pages</small>
      <div className="flex flex-col gap-1 mx-2 mt-2">
        {buttons.map((button: ButtonType, index: number) => (
          <Button
            key={index}
            className={`items-center w-full px-1 bg-inherit text-xs border-none text-slate-900 h-8 font-medium hover:bg-blue-200/50 ${
              id === button.id && "bg-gray-300"
            } focus:outline-none focus:ring-0`}
            icon={`${button.icon} me-4 text-xl`}
            onClick={() => {
              setId(button.id);
              navigate(button.path);
            }}
          >
            {button.name}
          </Button>
        ))}
      </div>
    </section>
  );
};

export default CrmUserSidebarSection;
