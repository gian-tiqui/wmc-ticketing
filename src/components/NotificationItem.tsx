import React from "react";
import { Notification } from "../types/types";
import { useNavigate } from "react-router-dom";
import { updateNotificationById } from "../@utils/services/notificationService";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Props {
  notification: Notification;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Notification[]>, Error>>;
}

const NotificationItem: React.FC<Props> = ({ notification, refetch }) => {
  const navigate = useNavigate();

  const handleNotificationClicked = () => {
    if (!notification) return;

    updateNotificationById(notification.id, { viewed: 1 })
      .then((response) => {
        if (response.status === 200) {
          refetch();
        }
      })
      .catch((error) => {
        console.error(error);
      });
    navigate(`/ticket/${notification.ticket.id}`);
  };

  return (
    <div
      onClick={handleNotificationClicked}
      key={notification.id}
      className={`w-full rounded cursor-pointer ${
        notification.viewed
          ? "hover:bg-gray-200 bg-white"
          : "hover:bg-gray-200 bg-white"
      }`}
    >
      <header className="p-3 rounded-t">{notification.title}</header>
      <div className="p-3">{notification.message}</div>
    </div>
  );
};

export default NotificationItem;
