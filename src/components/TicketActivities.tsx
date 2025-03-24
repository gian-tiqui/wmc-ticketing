import React from "react";
import { Ticket } from "../types/types";

interface Props {
  ticket: Ticket;
}

const TicketActivities: React.FC<Props> = ({ ticket }) => {
  return <div>Activities</div>;
};

export default TicketActivities;
