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
      icon: PrimeIcons.COG,
      path: "/categories",
      allowedRoles: ["admin", "user"],
    },
    {
      id: "reports",
      name: "Reports",
      icon: PrimeIcons.BOOK,
      path: "/reports",
      allowedRoles: ["admin", "user"],
    },
  ];

  const buttons: ButtonType[] = allButtons.filter((button) =>
    isAuthorized(user, button.allowedRoles)
  );

  return (
    <section className="flex-1 px-5 overflow-hidden">
      <div className="flex flex-col gap-2">
        {buttons.map((button: ButtonType, index: number) => (
          <Button
            key={index}
            className={`items-center w-full bg-white text-xs border-none text-slate-900 h-12 font-medium ${
              id === button.id && "bg-gray-600"
            }`}
            icon={`${button.icon} me-3`}
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
