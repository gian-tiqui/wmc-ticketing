import React from "react";
import { Ticket } from "../types/types"; // or whatever type your ticket uses
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import SentTicketItem from "./SentTicketsItem";

interface Props {
  tickets: Ticket[];
}

const SentTicketsPanel: React.FC<Props> = ({ tickets }) => {
  return (
    <div
      className={`flex flex-col w-full gap-2 h-72 overflow-y-auto ${scrollbarTheme}`}
    >
      {tickets.map((ticket) => (
        <SentTicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default SentTicketsPanel;
