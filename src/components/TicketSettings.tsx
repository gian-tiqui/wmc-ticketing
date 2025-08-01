import React from "react";
import { Ticket } from "../types/types";
import GeneralTicketSection from "./GeneralTicketSection";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import TicketStatusSection from "./TicketStatusSection";
import useUserDataStore from "../@utils/store/userDataStore";

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const TicketSettings: React.FC<Props> = ({ ticket, refetch }) => {
  const { user } = useUserDataStore();
  return (
    <div className="w-full h-full p-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
      <GeneralTicketSection ticket={ticket} refetch={refetch} />
      <TicketStatusSection
        ticket={ticket}
        refetch={refetch}
        currentUser={user}
      />
    </div>
  );
};

export default TicketSettings;
