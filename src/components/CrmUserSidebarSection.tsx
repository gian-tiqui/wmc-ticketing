import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { ButtonType } from "../types/types";
import { useNavigate } from "react-router-dom";
import useSelectedButtonStore from "../@utils/store/selectedButton";

const CrmUserSidebarSection = () => {
  const navigate = useNavigate();
  const { id, setId } = useSelectedButtonStore();
  const buttons: ButtonType[] = [
    {
      id: "tickets",
      name: "Tickets",
      icon: PrimeIcons.TICKET,
      path: "/tickets",
    },
    {
      id: "user",
      name: "Users",
      icon: PrimeIcons.USERS,
      path: "/tickets",
    },
  ];

  return (
    <section className="flex-1 px-5 overflow-hidden">
      <div className="flex flex-col gap-2">
        {buttons.map((button: ButtonType, index: number) => (
          <Button
            key={index}
            className={`items-center w-full h-12 font-medium ${
              id === button.id && "bg-gray-600"
            }`}
            icon={`${button.icon} me-3`}
            severity="contrast"
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
