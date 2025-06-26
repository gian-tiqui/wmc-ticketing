import { useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useMemo } from "react";
import useUserDataStore from "../@utils/store/userDataStore";
import { getUserTicketsById } from "../@utils/services/userService";
import { Divider } from "primereact/divider";
import SentTicketsPanel from "./SentTicketPanel";

const SentTicketsButton = () => {
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const { user } = useUserDataStore();

  const { data: userTicketsData } = useQuery({
    queryKey: [`user-tickets`, user?.sub],
    queryFn: () => getUserTicketsById(user?.sub, { limit: 100 }),
    enabled: !!user?.sub,
  });

  const tickets = useMemo(
    () => userTicketsData?.data.tickets ?? [],
    [userTicketsData]
  );

  const count = userTicketsData?.data.count || 0;

  return (
    <div className="relative">
      {count > 0 && (
        <div className="absolute z-10 grid w-4 h-4 text-xs font-bold bg-blue-100 rounded-full -bottom-1 place-content-center text-slate-900 -right-1">
          {count}
        </div>
      )}
      <Button
        icon={PrimeIcons.TICKET}
        className="w-8 h-8 bg-blue-600"
        onClick={(e) => overlayPanelRef.current?.toggle(e)}
      />
      <OverlayPanel ref={overlayPanelRef} className="w-72 h-96 bg-[#EEEEEE]">
        <header className="font-medium text-md">Sent Tickets</header>
        <Divider />
        {tickets.length > 0 ? (
          <SentTicketsPanel tickets={tickets} />
        ) : (
          <p className="font-medium">No tickets sent yet</p>
        )}
      </OverlayPanel>
    </div>
  );
};

export default SentTicketsButton;
