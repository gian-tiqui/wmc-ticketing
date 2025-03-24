import React from "react";
import { Ticket } from "../types/types";

interface Props {
  ticket: Ticket;
}

const TicketAction: React.FC<Props> = ({ ticket }) => {
  return <div>hi</div>;
};

export default TicketAction;
