import React from "react";
import { Ticket } from "../types/types";
import { useNavigate } from "react-router-dom";

interface Props {
  ticket: Ticket;
}

const SearchItem: React.FC<Props> = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/ticket/${ticket.id}`)}
      className="px-4 py-3 mb-2 transition-all duration-150 border border-gray-200 rounded-lg shadow-sm cursor-pointer group bg-gray-50 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">
          {ticket.title}
        </h4>
        {ticket.status && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {ticket.status.type}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-600 truncate">Ticket #{ticket.id}</p>
    </div>
  );
};

export default SearchItem;
