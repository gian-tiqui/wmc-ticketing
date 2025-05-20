import { useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import useUserDataStore from "../@utils/store/userDataStore";
import { Query } from "../types/types";
import { getUserNotificationsById } from "../@utils/services/userService";
import Notifications from "./Notifications";
import { Divider } from "primereact/divider";

const InboxButton = () => {
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const { user } = useUserDataStore();
  const [query, setQuery] = useState<Query>({ offset: 0, limit: 5 });

  const { data: userNotifications, refetch: refetchUserNotifications } =
    useQuery({
      queryKey: [`user-${user?.sub}-notifications-${JSON.stringify(query)}`],
      queryFn: () => getUserNotificationsById(user?.sub, query),
      enabled: !!user,
    });

  return (
    <div className="relative">
      <div className="absolute z-10 grid w-5 h-5 text-sm font-bold bg-blue-100 rounded-full -bottom-2 place-content-center text-slate-900 -right-1">
        {userNotifications?.data.count}
      </div>
      <Button
        icon={`${PrimeIcons.INBOX}`}
        className="bg-blue-600 w-9 h-9"
        onClick={(e) => overlayPanelRef.current?.toggle(e)}
      ></Button>
      <OverlayPanel ref={overlayPanelRef} className="w-72 h-96 bg-[#EEEEEE]">
        <header className="font-medium text-md">Notifications</header>
        <Divider />
        {userNotifications?.data && userNotifications.data.count > 0 ? (
          <Notifications
            refetch={refetchUserNotifications}
            notifications={userNotifications.data.notifications}
            setQuery={setQuery}
          />
        ) : (
          <p className="font-medium">No notifications yet</p>
        )}
      </OverlayPanel>
    </div>
  );
};

export default InboxButton;
