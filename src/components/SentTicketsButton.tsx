import { useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useMemo } from "react";
import useUserDataStore from "../@utils/store/userDataStore";
import { getUserTicketsById } from "../@utils/services/userService";
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
        <div className="absolute z-10 flex items-center justify-center h-5 text-xs font-bold text-white rounded-full shadow-lg -top-2 -right-2 min-w-5 bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
          {count > 99 ? "99+" : count}
        </div>
      )}

      <Button
        icon={PrimeIcons.TICKET}
        className="w-10 h-10 text-white transition-all duration-200 border shadow-lg bg-white/20 hover:bg-white/30 border-white/30 hover:border-white/50 rounded-xl backdrop-blur-sm hover:shadow-xl"
        onClick={(e) => overlayPanelRef.current?.toggle(e)}
        tooltip="Sent Tickets"
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
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg">
              <i className={`${PrimeIcons.TICKET} text-white text-sm`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Sent Tickets</h3>
              <p className="text-xs text-slate-600">{count} active tickets</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {tickets.length > 0 ? (
            <SentTicketsPanel tickets={tickets} />
          ) : (
            <div className="py-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
                <i
                  className={`${PrimeIcons.TICKET} text-slate-400 text-xl`}
                ></i>
              </div>
              <p className="font-medium text-slate-600">No tickets sent yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Your submitted tickets will appear here
              </p>
            </div>
          )}
        </div>
      </OverlayPanel>
    </div>
  );
};

export default SentTicketsButton;
