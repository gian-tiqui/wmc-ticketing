import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import useUserDataStore from "../@utils/store/userDataStore";
import { Query, Ticket } from "../types/types";
import roleIncludes from "../@utils/functions/rolesIncludes";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../@utils/services/ticketService";
import { getUserTicketsById } from "../@utils/services/userService";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import SearchItem from "./SearchItem";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const SearchDialog: React.FC<Props> = ({ setVisible, visible }) => {
  const { user } = useUserDataStore();
  const [query, setQuery] = useState<Query>({ search: "" });
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    setQuery((prev) => ({ ...prev, deptId: user?.deptId }));
  }, [user]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchTerm }));
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const { data: ticketResults } = useQuery({
    queryKey: [`search-tickets-${JSON.stringify(query)}`],
    queryFn: () =>
      roleIncludes(user, "admin")
        ? getTickets({ ...query })
        : getUserTicketsById(user?.sub, { ...query }),
  });

  return (
    <Dialog
      onHide={() => setVisible(false)}
      visible={visible}
      pt={{ mask: { className: "backdrop-blur" } }}
      className="w-full max-w-lg rounded-xl"
      contentClassName="bg-white rounded-b-xl"
      headerClassName="bg-white border-b"
      header={
        <div className="px-3 py-2">
          <IconField iconPosition="left" className="w-full">
            <InputIcon className="pi pi-search" />
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets..."
              className="w-full h-10 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </IconField>
        </div>
      }
    >
      <div
        className={`max-h-[350px] overflow-y-auto px-2 py-1 ${scrollbarTheme}`}
      >
        {ticketResults?.data.tickets?.length ? (
          ticketResults.data.tickets.map((ticket: Ticket) => (
            <SearchItem ticket={ticket} key={ticket.id} />
          ))
        ) : (
          <p className="px-3 py-6 text-sm text-center text-gray-500">
            No tickets found.
          </p>
        )}
      </div>
    </Dialog>
  );
};

export default SearchDialog;
