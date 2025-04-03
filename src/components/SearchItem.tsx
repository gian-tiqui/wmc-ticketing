import { Button } from "primereact/button";
import React from "react";
import { Ticket } from "../types/types";
import { PrimeIcons } from "primereact/api";
import { useNavigate } from "react-router-dom";

interface Props {
  ticket: Ticket;
}

const SearchItem: React.FC<Props> = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <Button
      icon={`${PrimeIcons.TICKET} text-xl`}
      className="items-center w-full gap-2 font-medium"
      onClick={() => navigate(`/ticket/${ticket.id}`)}
    >
      {ticket.title}
    </Button>
  );
};

export default SearchItem;
