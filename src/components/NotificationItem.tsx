import React from "react";
import { Notification } from "../types/types";
import { useNavigate } from "react-router-dom";
import { updateNotificationById } from "../@utils/services/notificationService";

interface Props {
  notification: Notification;
  refetch: () => void;
}

const NotificationItem: React.FC<Props> = ({ notification, refetch }) => {
  const navigate = useNavigate();

  const handleNotificationClicked = async () => {
    if (!notification) return;

    try {
      const response = await updateNotificationById(notification.id, {
        viewed: 1,
      });
      if (response.status === 200) {
        refetch();
      }
    } catch (error) {
      console.error("Failed to update notification:", error);
    }

    navigate(`/ticket/${notification.ticket.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={handleNotificationClicked}
      className={`group relative w-full px-3 py-3 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.01] hover:shadow-lg border-l-4 ${
        notification.viewed
          ? "bg-white border-l-gray-200 hover:bg-gray-50"
          : "bg-gradient-to-r from-blue-50 to-white border-l-blue-500 hover:from-blue-100 hover:to-blue-50"
      } rounded-lg shadow-sm hover:shadow-md mb-2 overflow-hidden`}
      style={{ minHeight: "130px" }}
    >
      {/* Unread indicator */}
      {!notification.viewed && (
        <div className="absolute w-2 h-2 bg-blue-500 rounded-full top-2 right-2 animate-pulse" />
      )}

      {/* Header with title and timestamp */}
      <div className="flex items-start justify-between pr-4 mb-2">
        <h3
          className={`font-semibold text-sm leading-tight flex-1 pr-2 ${
            notification.viewed ? "text-gray-700" : "text-gray-900"
          } group-hover:text-blue-600 transition-colors duration-200`}
        >
          {notification.title}
        </h3>
        {notification.createdAt && (
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatDate(notification.createdAt.toString())}
          </span>
        )}
      </div>

      {/* Message content */}
      <p
        className={`text-xs leading-relaxed mb-2 ${
          notification.viewed ? "text-gray-600" : "text-gray-700"
        } line-clamp-2`}
      >
        {notification.message}
      </p>

      {/* Ticket info if available */}
      {notification.ticket && (
        <div className="flex items-center text-xs text-gray-500">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          <span>Ticket #{notification.ticket.id}</span>
        </div>
      )}

      {/* Hover overlay effect */}
      <div className="absolute inset-0 transition-opacity duration-200 opacity-0 pointer-events-none bg-gradient-to-r from-transparent to-blue-500/5 group-hover:opacity-100" />
    </div>
  );
};

export default NotificationItem;
