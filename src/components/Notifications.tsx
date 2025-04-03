import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Notification, Query } from "../types/types";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import NotificationItem from "./NotificationItem";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Props {
  notifications: Notification[];
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Notification[]>, Error>>;
  setQuery: Dispatch<SetStateAction<Query>>;
}

const Notifications: React.FC<Props> = ({
  notifications,
  refetch,
  setQuery,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 1) {
        setQuery((prev) => {
          if (prev.limit) {
            return { ...prev, limit: prev.limit + 5 };
          }

          return { ...prev, limit: prev.limit };
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [setQuery]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col w-full gap-2 h-72 overflow-y-auto ${scrollbarTheme}`}
    >
      {notifications.map((notification) => (
        <NotificationItem
          refetch={refetch}
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
};

export default Notifications;
