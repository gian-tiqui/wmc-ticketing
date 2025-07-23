import React, { useState } from "react";
import { Ticket } from "../types/types";
import { useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import TicketSettingsDialog from "./TicketSettingsDialog";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const TicketHeader: React.FC<Props> = ({ ticket, refetch }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500); // Brief delay for visual feedback
  };

  return (
    <header className="sticky top-0 z-40 bg-[#EEE]/95 backdrop-blur-lg border-b border-[#CBD5E1]/50">
      <TicketSettingsDialog
        setVisible={setVisible}
        visible={visible}
        ticket={ticket}
      />

      {/* Breadcrumb Navigation */}
      <div className="px-6 pt-6 pb-2">
        <nav className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => navigate("/ticket")}
            className="flex items-center px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-[#EEE] rounded-lg transition-all duration-200 font-medium"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Tickets
          </button>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="px-3 py-1.5 text-gray-900 font-medium bg-[#EEE] rounded-lg">
            {ticket.title}
          </span>
        </nav>
      </div>

      {/* Main Header Content */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Modern Avatar with Gradient */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-sm opacity-20"></div>
              <Avatar
                label={ticket.id.toString()}
                className="relative text-xl font-bold text-white shadow-lg w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl"
              />
              {/* Status indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#EEE] shadow-sm">
                <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Title and Meta Info */}
            <div className="flex-1 min-w-0">
              <h1 className="mb-1 text-2xl font-bold text-gray-900 truncate">
                {ticket.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  #{ticket.id}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              icon={isRefreshing ? "pi pi-spin" : PrimeIcons.REFRESH}
              severity="contrast"
              className={`w-11 h-11 rounded-xl bg-[#EEE] hover:bg-[#CBD5E1] border-0 shadow-sm transition-all duration-200 ${
                isRefreshing ? "animate-spin" : "hover:scale-105"
              }`}
              onClick={handleRefresh}
              disabled={isRefreshing}
              tooltip="Refresh ticket"
              tooltipOptions={{ position: "bottom" }}
            />

            <Button
              icon={PrimeIcons.COG}
              severity="contrast"
              className="w-11 h-11 rounded-xl bg-[#EEE] hover:bg-[#CBD5E1] border-0 shadow-sm transition-all duration-200 hover:scale-105"
              onClick={() => setVisible(true)}
              tooltip="Ticket settings"
              tooltipOptions={{ position: "bottom" }}
            />

            <Button
              icon={PrimeIcons.ELLIPSIS_V}
              severity="contrast"
              className="w-11 h-11 rounded-xl bg-[#EEE] hover:bg-[#CBD5E1] border-0 shadow-sm transition-all duration-200 hover:scale-105"
              tooltip="More options"
              tooltipOptions={{ position: "bottom" }}
            />
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CBD5E1]/40 to-transparent"></div>
    </header>
  );
};

export default TicketHeader;
