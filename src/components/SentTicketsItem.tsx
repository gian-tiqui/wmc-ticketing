import React from "react";
import { Ticket } from "../types/types"; // define as needed
import { useNavigate } from "react-router-dom";

interface Props {
  ticket: Ticket;
}

const SentTicketItem: React.FC<Props> = ({ ticket }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ticket/${ticket.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative w-full px-3 py-3 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.01] hover:shadow-lg bg-white rounded-lg shadow-sm border-l-4 border-blue-500 mb-2"
      style={{ minHeight: "110px" }}
    >
      {/* Title */}
      <div className="flex items-start justify-between pr-4 mb-2">
        <h3 className="flex-1 pr-2 text-sm font-semibold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
          {ticket.title}
        </h3>
        {ticket.createdAt && (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {ticket.createdAt}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mb-2 text-xs text-gray-700 line-clamp-2">
        {ticket.description}
      </p>

      {/* Resolution status */}
      <p className="text-xs italic text-gray-500">
        {ticket.resolution ? "Resolved" : "Pending"}
      </p>

      {/* Hover overlay */}
      <div className="absolute inset-0 transition-opacity duration-200 opacity-0 pointer-events-none bg-gradient-to-r from-transparent to-blue-500/5 group-hover:opacity-100" />
    </div>
  );
};

export default SentTicketItem;
