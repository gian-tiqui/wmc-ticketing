import { useInfiniteQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState, useMemo } from "react";
import useUserDataStore from "../@utils/store/userDataStore";
import { Query } from "../types/types";
import { getUserNotificationsById } from "../@utils/services/userService";
import Notifications from "./Notifications";

const InboxButton = () => {
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const { user } = useUserDataStore();
  const [, setQuery] = useState<Query>({ offset: 0, limit: 5 });

  const {
    data: userNotificationsData,
    refetch: refetchUserNotifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [`user-${user?.sub}-notifications`],
    queryFn: ({ pageParam = { offset: 0, limit: 5 } }) =>
      getUserNotificationsById(user?.sub, pageParam),
    enabled: !!user,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, page) => sum + page.data.notifications.length,
        0
      );
      if (totalFetched >= lastPage.data.count) {
        return undefined;
      }
      return {
        offset: totalFetched,
        limit: 5,
      };
    },
    initialPageParam: { offset: 0, limit: 5 },
  });

  const allNotifications = useMemo(() => {
    if (!userNotificationsData?.pages) return [];
    return userNotificationsData.pages.flatMap(
      (page) => page.data.notifications
    );
  }, [userNotificationsData]);

  const totalCount = userNotificationsData?.pages[0]?.data.count || 0;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="relative">
      {totalCount > 0 && (
        <div className="absolute z-10 flex items-center justify-center h-5 text-xs font-bold text-white rounded-full shadow-lg -top-2 -right-2 min-w-5 bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse">
          {totalCount > 99 ? "99+" : totalCount}
        </div>
      )}

      <Button
        icon={`${PrimeIcons.BELL}`}
        className="w-10 h-10 text-white transition-all duration-200 border shadow-lg bg-white/20 hover:bg-white/30 border-white/30 hover:border-white/50 rounded-xl backdrop-blur-sm hover:shadow-xl"
        onClick={(e) => overlayPanelRef.current?.toggle(e)}
        tooltip="Notifications"
        tooltipOptions={{ position: "bottom" }}
      />

      <OverlayPanel
        ref={overlayPanelRef}
        className="overflow-hidden border-0 shadow-2xl w-80 max-h-96 rounded-2xl"
        pt={{
          root: {
            className:
              "bg-gradient-to-b from-white to-slate-50 backdrop-blur-xl border border-slate-200/50",
          },
          content: {
            className: "p-0",
          },
        }}
      >
        <div className="p-6 border-b bg-gradient-to-r from-emerald-50 to-teal-50 border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500">
              <i className={`${PrimeIcons.BELL} text-white text-sm`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-600">{totalCount} unread</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {totalCount > 0 ? (
            <Notifications
              refetch={() => refetchUserNotifications()}
              notifications={allNotifications}
              setQuery={setQuery}
              onLoadMore={handleLoadMore}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <div className="py-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
                <i className={`${PrimeIcons.BELL} text-slate-400 text-xl`}></i>
              </div>
              <p className="font-medium text-slate-600">No notifications yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Updates will appear here
              </p>
            </div>
          )}
        </div>
      </OverlayPanel>
    </div>
  );
};

export default InboxButton;
