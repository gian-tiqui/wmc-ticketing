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
      className="items-center w-full h-12 gap-2 mb-2 font-medium text-black bg-white border-none shadow"
      onClick={() => navigate(`/ticket/${ticket.id}`)}
    >
      {ticket.title} {ticket.status && `(${ticket.status.type})`}
    </Button>
  );
};

export default SearchItem;
