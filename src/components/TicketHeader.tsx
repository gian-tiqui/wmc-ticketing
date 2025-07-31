import React, { useState } from "react";
import { ChevronLeft, RotateCcw, Hash } from "lucide-react";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import TicketSettingsDialog from "./TicketSettingsDialog";
import { Ticket } from "../types/types";

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const TicketHeader: React.FC<Props> = ({ ticket, refetch }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const navigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b shadow-sm bg-white/95 backdrop-blur-lg border-gray-200/50">
      <TicketSettingsDialog
        setVisible={setVisible}
        visible={visible}
        ticket={ticket}
      />

      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation and Title */}
          <div className="flex items-center flex-1 min-w-0 space-x-3">
            {/* Back Button */}
            <button
              onClick={() => navigate("/ticket")}
              className="flex items-center justify-center w-8 h-8 text-gray-600 transition-all duration-200 rounded-lg hover:text-blue-600 hover:bg-blue-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Breadcrumb Separator */}
            <div className="w-px h-4 bg-gray-300"></div>

            {/* Compact Avatar */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-lg shadow-sm bg-gradient-to-br from-blue-500 to-purple-600">
                {ticket.id.toString().slice(-2)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Title and ID */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  {ticket.title}
                </h1>
                <div className="flex items-center flex-shrink-0 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md">
                  <Hash className="w-3 h-3 mr-1" />
                  {ticket.id}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center flex-shrink-0 space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 ${
                isRefreshing ? "animate-spin" : "hover:scale-105"
              }`}
              title="Refresh ticket"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>

            {/* <button
              onClick={() => setVisible(true)}
              className="flex items-center justify-center w-8 h-8 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200 hover:scale-105"
              title="Ticket settings"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>

            <button
              className="flex items-center justify-center w-8 h-8 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200 hover:scale-105"
              title="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/40 to-transparent"></div>
    </header>
  );
};

export default TicketHeader;
