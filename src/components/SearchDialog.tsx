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
    const interval = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchTerm }));
    }, 700);

    return () => clearTimeout(interval);
  }, [searchTerm]);

  const { data: ticketResults } = useQuery({
    queryKey: [
      `search-tickets-${JSON.stringify({
        ...query,
      })}`,
    ],
    queryFn: () =>
      roleIncludes(user, "admin")
        ? getTickets({ ...query })
        : getUserTicketsById(user?.sub, {
            ...query,
          }),
  });

  return (
    <Dialog
      onHide={() => {
        if (visible) setVisible(false);
      }}
      contentClassName="bg-[#EEEEEE]"
      headerClassName="bg-[#EEEEEE]"
      visible={visible}
      pt={{
        mask: { className: "backdrop-blur" },
      }}
      header={
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="items-center w-full h-12 text-sm bg-white border-black"
          />
        </IconField>
      }
      className="w-92 md:w-[40%]  h-96 md:h-[70%]"
    >
      <div className={`w-full h-72 gap-2 ${scrollbarTheme} overflow-auto`}>
        {ticketResults?.data.tickets && ticketResults?.data.count > 0 ? (
          ticketResults.data.tickets.map((ticket: Ticket) => (
            <SearchItem ticket={ticket} key={ticket.id} />
          ))
        ) : (
          <p>No tickets found</p>
        )}
      </div>
    </Dialog>
  );
};

export default SearchDialog;
