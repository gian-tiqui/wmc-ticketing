import React, { useState, useRef, useEffect } from "react";
import { Ticket } from "../types/types";
import { PrimeIcons } from "primereact/api";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";

interface Props {
  ticket: Ticket;
}

const TicketActivities: React.FC<Props> = ({ ticket }) => {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const timelineRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        timelineRef.current &&
        !timelineRef.current.contains(event.target as Node)
      ) {
        setActiveItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getActivityConfig = (activity: string) => {
    const configs = {
      created: {
        color: "from-blue-500 to-blue-600",
        shadowColor: "shadow-blue-200",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        icon: PrimeIcons.PLUS_CIRCLE,
        label: "Ticket Created",
        description: "New support ticket has been submitted",
      },
      assigned: {
        color: "from-purple-500 to-purple-600",
        shadowColor: "shadow-purple-200",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        icon: PrimeIcons.USER,
        label: "Assigned to Agent",
        description: "Ticket assigned to support team member",
      },
      in_progress: {
        color: "from-orange-500 to-orange-600",
        shadowColor: "shadow-orange-200",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
        icon: PrimeIcons.COG,
        label: "Work in Progress",
        description: "Agent is actively working on this issue",
      },
      escalated: {
        color: "from-red-500 to-red-600",
        shadowColor: "shadow-red-200",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        icon: PrimeIcons.EXCLAMATION_TRIANGLE,
        label: "Escalated",
        description: "Issue escalated to senior support team",
      },
      resolved: {
        color: "from-emerald-500 to-emerald-600",
        shadowColor: "shadow-emerald-200",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        icon: PrimeIcons.CHECK_CIRCLE,
        label: "Issue Resolved",
        description: "Problem has been successfully fixed",
      },
      closed: {
        color: "from-slate-500 to-slate-600",
        shadowColor: "shadow-slate-200",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        textColor: "text-slate-700",
        icon: PrimeIcons.TIMES_CIRCLE,
        label: "Ticket Closed",
        description: "Support case has been completed and closed",
      },
      reopened: {
        color: "from-amber-500 to-amber-600",
        shadowColor: "shadow-amber-200",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        icon: PrimeIcons.REFRESH,
        label: "Reopened",
        description: "Ticket reopened for additional assistance",
      },
    };

    return configs[activity as keyof typeof configs] || configs.created;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const updatePopupPosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    // Calculate position relative to the viewport, accounting for scroll
    const x = rect.left + rect.width / 2 + scrollX;
    const y = rect.top + scrollY;

    setPopupPosition({ x, y });
  };

  const handleMarkerHover = (index: number, event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    updatePopupPosition(target);
    setHoveredItem(index);
  };

  const handleMarkerClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    updatePopupPosition(target);
    setActiveItem(activeItem === index ? null : index);
    setHoveredItem(null);
  };

  // Add scroll listener to update popup position when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (activeItem !== null || hoveredItem !== null) {
        // Find the active marker and update position
        const activeIndex = activeItem !== null ? activeItem : hoveredItem;
        const marker = timelineRef.current?.querySelector(
          `[data-marker-index="${activeIndex}"]`
        ) as HTMLElement;
        if (marker) {
          updatePopupPosition(marker);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [activeItem, hoveredItem]);

  if (!ticket.activities || ticket.activities.length === 0) {
    return (
      <div className="relative max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 blur-xl opacity-60"></div>
            <div className="relative p-6 border border-gray-100 rounded-full bg-gradient-to-r from-blue-50 to-purple-50">
              <i className={`${PrimeIcons.CLOCK} text-gray-400 text-3xl`}></i>
            </div>
          </div>
          <h3 className="mb-3 text-xl font-semibold text-gray-800">
            No Activity History
          </h3>
          <p className="max-w-md leading-relaxed text-gray-600">
            Activity timeline will appear here as actions are performed on this
            ticket.
          </p>
        </div>
      </div>
    );
  }

  const displayedItem = activeItem !== null ? activeItem : hoveredItem;
  const currentActivity =
    displayedItem !== null ? ticket.activities[displayedItem] : null;

  return (
    <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
      {/* Header */}
      <div className="relative mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 rounded-2xl"></div>
        <div className="relative p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-20"></div>
              <div className="relative p-3 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <i className={`${PrimeIcons.HISTORY} text-white text-lg`}></i>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Activity Timeline
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {ticket.activities.length}{" "}
                {ticket.activities.length === 1 ? "update" : "updates"} • Hover
                over markers to see details
              </p>
            </div>
            <div className="hidden sm:block text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              💡 Click to pin details
            </div>
          </div>
        </div>
      </div>

      {/* Shopee-style Popup */}
      {currentActivity && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: popupPosition.x,
            top: popupPosition.y - 10,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="duration-200 animate-in fade-in zoom-in-95">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 max-w-[90vw] overflow-hidden">
              {/* Header with colored accent */}
              <div
                className={`h-1 bg-gradient-to-r ${
                  getActivityConfig(currentActivity.activity).color
                }`}
              ></div>

              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      getActivityConfig(currentActivity.activity).bgColor
                    }`}
                  >
                    <i
                      className={`${
                        getActivityConfig(currentActivity.activity).icon
                      } ${
                        getActivityConfig(currentActivity.activity).textColor
                      } text-base`}
                    ></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-sm font-semibold text-gray-900">
                      {currentActivity.title ||
                        getActivityConfig(currentActivity.activity).label}
                    </h3>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {currentActivity.activity ||
                        getActivityConfig(currentActivity.activity).description}
                    </p>
                  </div>
                </div>

                {/* Time and details */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <i className={`${PrimeIcons.CLOCK} text-gray-400`}></i>
                    <span>{getRelativeTime(currentActivity.createdAt)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(currentActivity.createdAt)}
                  </div>
                </div>
              </div>

              {/* Arrow pointing to marker */}
              <div className="absolute transform -translate-x-1/2 top-full left-1/2">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white filter drop-shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clean Timeline with Only Markers */}
      <div className={`${scrollbarTheme} overflow-auto max-h-[60vh] px-4`}>
        <div className="relative flex items-center justify-center py-8">
          {/* Horizontal Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

          {/* Timeline Markers */}
          <div className="relative flex items-center justify-between w-full max-w-4xl">
            {ticket.activities.map((activity, index) => {
              const config = getActivityConfig(activity.activity);
              const isFirst = index === 0;
              const isLast = index === ticket.activities.length - 1;
              const isActive = activeItem === index;
              const isHovered = hoveredItem === index;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center group"
                  style={{ flex: "1" }}
                >
                  {/* Marker */}
                  <div
                    data-marker-index={index}
                    className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${
                      config.color
                    } 
                      shadow-lg ${
                        config.shadowColor
                      } cursor-pointer transition-all duration-300 transform
                      ${
                        isHovered || isActive
                          ? "scale-150 shadow-xl"
                          : "hover:scale-125 hover:shadow-lg"
                      }
                      ${isActive ? "ring-4 ring-white ring-opacity-80" : ""}
                    `}
                    onMouseEnter={(e) => handleMarkerHover(index, e)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={(e) => handleMarkerClick(index, e)}
                  >
                    {/* Icon (visible on hover/active) */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                        isHovered || isActive ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <i
                        className={`${config.icon} text-white text-xs drop-shadow-sm`}
                      ></i>
                    </div>

                    {/* Pulse animation for latest */}
                    {isLast && (
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.color} animate-ping opacity-30`}
                      ></div>
                    )}
                  </div>

                  {/* Mini time indicator below marker (always visible) */}
                  <div className="mt-3 text-center">
                    <div className="text-xs font-medium text-gray-500">
                      {getRelativeTime(activity.createdAt)}
                    </div>
                    {(isFirst || isLast) && (
                      <div
                        className={`mt-1 text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor} font-medium`}
                      >
                        {isFirst ? "Start" : "Latest"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Navigation Hint */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 rounded-full bg-gray-50">
          <i className={`${PrimeIcons.INFO_CIRCLE} text-gray-400`}></i>
          <span className="hidden sm:inline">
            Hover over markers to see details
          </span>
          <span className="sm:hidden">Tap markers to see details</span>
        </div>
      </div>
    </div>
  );
};

export default TicketActivities;
