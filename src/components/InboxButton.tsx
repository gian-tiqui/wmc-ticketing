import { useInfiniteQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState, useMemo } from "react";
import useUserDataStore from "../@utils/store/userDataStore";
import { Query } from "../types/types";
import { getUserNotificationsById } from "../@utils/services/userService";
import Notifications from "./Notifications";
import { Divider } from "primereact/divider";

const InboxButton = () => {
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const { user } = useUserDataStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setQuery] = useState<Query>({ offset: 0, limit: 5 });

  // Use useInfiniteQuery instead of useQuery for infinite scrolling
  const {
    data: userNotificationsData,
    refetch: refetchUserNotifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [`user-${user?.sub}-notifications`], // Remove query from key
    queryFn: ({ pageParam = { offset: 0, limit: 5 } }) =>
      getUserNotificationsById(user?.sub, pageParam),
    enabled: !!user,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, page) => sum + page.data.notifications.length,
        0
      );
      if (totalFetched >= lastPage.data.count) {
        return undefined; // No more pages
      }
      return {
        offset: totalFetched,
        limit: 5,
      };
    },
    initialPageParam: { offset: 0, limit: 5 },
  });

  // Flatten all notifications from all pages
  const allNotifications = useMemo(() => {
    if (!userNotificationsData?.pages) return [];
    return userNotificationsData.pages.flatMap(
      (page) => page.data.notifications
    );
  }, [userNotificationsData]);

  // Get total count from the first page
  const totalCount = userNotificationsData?.pages[0]?.data.count || 0;

  // Modified setQuery function to trigger fetchNextPage instead
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="relative">
      <div className="absolute z-10 grid w-4 h-4 text-xs font-bold bg-blue-100 rounded-full -bottom-1 place-content-center text-slate-900 -right-1">
        {totalCount}
      </div>
      <Button
        icon={`${PrimeIcons.INBOX}`}
        className="w-8 h-8 bg-blue-600"
        onClick={(e) => overlayPanelRef.current?.toggle(e)}
      ></Button>
      <OverlayPanel ref={overlayPanelRef} className="w-72 h-96 bg-[#EEEEEE]">
        <header className="font-medium text-md">Notifications</header>
        <Divider />
        {totalCount > 0 ? (
          <Notifications
            refetch={() => refetchUserNotifications()}
            notifications={allNotifications}
            setQuery={setQuery} // You can remove this prop if you want
            onLoadMore={handleLoadMore} // Add this new prop
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : (
          <p className="font-medium">No notifications yet</p>
        )}
      </OverlayPanel>
    </div>
  );
};

export default InboxButton;
