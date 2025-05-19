import { PrimeIcons } from "primereact/api";
import React from "react";
import RequestDetails from "./RequestDetails";
import { SummaryCardType, Ticket } from "../types/types";
import SummaryItem from "./SummaryItem";

interface Props {
  ticket: Ticket;
}

const TicketSummary: React.FC<Props> = ({ ticket }) => {
  const cards: SummaryCardType[] = [
    {
      details: `Status: ${ticket.status.type}`,
      summary: "",
      icon: PrimeIcons.CHECK_CIRCLE,
    },
    {
      details: `Priority Level: ${ticket.priorityLevel.name}`,
      summary: "",
      icon: PrimeIcons.INFO_CIRCLE,
    },
    {
      details: `${ticket.createdAt.split(" at ")[0]}`,
      summary: "Date Requested",
      icon: PrimeIcons.CALENDAR,
    },
    {
      details: `${ticket.createdAt.split(" at ")[1]}`,
      summary: "Time Requested",
      icon: PrimeIcons.CLOCK,
    },
    {
      details: `${
        ticket.acknowledgedAt
          ? ticket.acknowledgedAt.split(" at ")[0]
          : "Unacknowledged yet"
      }`,
      summary: "Date Acknowledged",
      icon: PrimeIcons.CALENDAR,
    },
    {
      details: `${
        ticket.acknowledgedAt
          ? ticket.acknowledgedAt.split(" at ")[1]
          : "Unacknowledged yet"
      }`,
      summary: "Time Acknowledged",
      icon: PrimeIcons.CLOCK,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex w-full h-20 col-span-1 rounded-lg shadow md:col-span-2 h-18 hover:shadow-blue-900 bg-[#EEEEEE]">
            <div className="w-5 h-full bg-blue-500 rounded-s-lg"></div>
            <div className="flex flex-col justify-between p-4">
              <div className="flex items-center gap-2">
                <i className={PrimeIcons.ALIGN_CENTER}></i>
                <p className="text-sm">{"Category"}</p>
              </div>{" "}
              <p className="text-sm font-medium">{ticket.category.name}</p>
            </div>
          </div>
          {cards.map((card, index) => (
            <SummaryItem
              details={card.details}
              icon={card.icon}
              summary={card.summary}
              key={index}
            />
          ))}
        </div>
      </div>

      <RequestDetails ticket={ticket} />
    </div>
  );
};

export default TicketSummary;
