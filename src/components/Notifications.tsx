import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Notification, Query } from "../types/types";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import NotificationItem from "./NotificationItem";

interface Props {
  notifications: Notification[];
  refetch: () => void; // Simplified refetch function
  setQuery: Dispatch<SetStateAction<Query>>;
  onLoadMore?: () => void; // New prop for loading more
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const Notifications: React.FC<Props> = ({
  notifications,
  refetch,
  setQuery,
  onLoadMore,
  hasNextPage = true,
  isFetchingNextPage = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Use intersection observer for infinite scrolling
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;

    if (!sentinel || !container || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log(
            "🔄 Loading more notifications via intersection observer"
          );
          onLoadMore();
        }
      },
      {
        root: container,
        rootMargin: "20px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasNextPage, isFetchingNextPage]);

  // Fallback scroll handler (if onLoadMore is not provided)
  const handleScroll = useCallback(() => {
    if (!containerRef.current || onLoadMore) return; // Skip if using onLoadMore

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setQuery((prev) => ({
        ...prev,
        limit: (prev.limit || 10) + 5,
      }));
    }
  }, [setQuery, onLoadMore]);

  useEffect(() => {
    if (onLoadMore) return; // Skip if using intersection observer

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, onLoadMore]);

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

      {/* Sentinel element for intersection observer */}
      {onLoadMore && hasNextPage && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center h-4 text-xs text-gray-500"
        >
          {isFetchingNextPage ? "Loading more..." : ""}
        </div>
      )}

      {/* End message */}
      {onLoadMore && !hasNextPage && notifications.length > 0 && (
        <div className="py-2 text-xs text-center text-gray-500">
          No more notifications
        </div>
      )}
    </div>
  );
};

export default Notifications;
