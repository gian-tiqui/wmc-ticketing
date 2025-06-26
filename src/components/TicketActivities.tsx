import React, { useState } from "react";
import { Timeline } from "primereact/timeline";
import { Activity, Ticket } from "../types/types";
import { PrimeIcons } from "primereact/api";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";

interface Props {
  ticket: Ticket;
}

const TicketActivities: React.FC<Props> = ({ ticket }) => {
  const [hoveredItem, setHoveredItem] = useState<Activity | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (item: Activity, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // const customizedContent = (item: Activity) => (
  //   <div className="relative">
  //     {/* Modern Activity Label */}
  //     <div className="mt-3 text-center">
  //       <div
  //         className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer"
  //         onMouseEnter={(e) => handleMouseEnter(item, e)}
  //         onMouseLeave={handleMouseLeave}
  //       >
  //         <span className="text-xs font-medium text-gray-700">
  //           {item.title.split(" ")[1] || item.title}
  //         </span>
  //       </div>
  //     </div>
  //   </div>
  // );

  const customizedMarker = (item: Activity) => {
    const getActivityStyle = () => {
      switch (item.activity) {
        case "resolved":
          return "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-200";
        case "closed":
          return "bg-gradient-to-r from-slate-500 to-slate-600 shadow-slate-200";
        case "escalated":
          return "bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-200";
        case "assigned":
          return "bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-200";
        default:
          return "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-200";
      }
    };

    return (
      <div className="relative">
        {/* Animated Ring */}
        <div
          className={`absolute inset-0 rounded-full animate-pulse ${
            getActivityStyle().split(" ")[0]
          } opacity-20 scale-125`}
        ></div>

        {/* Main Marker */}
        <div
          className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 text-white shadow-lg hover:scale-110 hover:shadow-xl cursor-pointer ${getActivityStyle()}`}
          onMouseEnter={(e) => handleMouseEnter(item, e)}
          onMouseLeave={handleMouseLeave}
        >
          <i
            className={`${
              item.icon ?? PrimeIcons.INFO_CIRCLE
            } text-sm drop-shadow-sm`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Hover Card Portal - Outside of scrollable container */}
      {hoveredItem && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: hoverPosition.x,
            top: hoverPosition.y - 20,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="transition-all duration-300 ease-out">
            <div className="border shadow-2xl backdrop-blur-xl bg-white/95 border-white/20 rounded-2xl ring-1 ring-black/5 w-80">
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`p-2 rounded-xl ${
                      hoveredItem.activity === "resolved"
                        ? "bg-emerald-100 text-emerald-600"
                        : hoveredItem.activity === "closed"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <i
                      className={`${
                        hoveredItem.icon ?? PrimeIcons.INFO_CIRCLE
                      } text-sm`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {hoveredItem.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(hoveredItem.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  {hoveredItem.activity}
                </p>
              </div>

              {/* Arrow */}
              <div className="absolute transform -translate-x-1/2 top-full left-1/2">
                <div className="border-8 border-transparent border-t-white/95"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content Container */}
      <div className={`overflow-auto h-[65vh] ${scrollbarTheme}`}>
        {/* Modern Header with Gradient */}
        <div className="relative mb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>
          <div className="relative p-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
                <div className="relative p-3 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                  <i className={`${PrimeIcons.HISTORY} text-white text-xl`}></i>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  Activity Timeline
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Track every action and milestone in your ticket's journey
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Timeline Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white rounded-3xl"></div>
          <div className="relative p-8">
            {ticket.activities && ticket.activities.length > 0 ? (
              <div className="pb-6 overflow-x-auto">
                <div className="min-w-fit">
                  <Timeline
                    value={ticket.activities}
                    layout="horizontal"
                    align="top"
                    marker={customizedMarker}
                    className="min-w-[600px] custom-timeline"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 mb-4 bg-gray-100 rounded-full">
                  <i
                    className={`${PrimeIcons.CLOCK} text-gray-400 text-2xl`}
                  ></i>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  No Activities Yet
                </h3>
                <p className="max-w-md text-gray-500">
                  Activity history will appear here as actions are performed on
                  this ticket.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .custom-timeline :global(.p-timeline-event-connector) {
          background: linear-gradient(
            90deg,
            #e5e7eb 0%,
            #d1d5db 50%,
            #e5e7eb 100%
          );
          height: 3px;
          border-radius: 2px;
        }

        .custom-timeline
          :global(
            .p-timeline-horizontal
              .p-timeline-event:not(:last-child)
              .p-timeline-event-connector
          ) {
          width: 100%;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-timeline :global(.p-timeline-event) {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TicketActivities;
