import React from "react";
import { Ticket } from "../types/types";
import { useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";

interface Props {
  ticket: Ticket;
}

const TicketHeader: React.FC<Props> = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <header className="mb-4">
      <div className="flex w-full gap-1 px-8 pt-6 font-mono text-gray-400">
        <h4
          className="cursor-pointer hover:underline"
          onClick={() => navigate("/ticket")}
        >
          Tickets
        </h4>
        <h4 className="">/</h4>
        <h4
          className="cursor-pointer hover:underline"
          onClick={() => navigate(`/ticket/${ticket.id}`)}
        >
          {ticket.title}
        </h4>
      </div>
      <div className="flex items-center w-full gap-3 px-8 pt-3">
        <div className="flex items-center gap-3">
          <Avatar
            label={ticket.id.toString()}
            className="w-10 h-10 text-xl font-extrabold bg-blue-500"
          />
          <h4 className="text-xl font-medium ">{ticket.title}</h4>
        </div>
        <Button
          icon={PrimeIcons.ELLIPSIS_H}
          severity="contrast"
          className="w-10 h-10 rounded-full bg-inherit"
        />
      </div>
    </header>
  );
};

export default TicketHeader;
