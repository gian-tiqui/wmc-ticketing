import React, { useState } from "react";
import { PriorityLevel, Query, Ticket } from "../types/types";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { getPriorityLevels } from "../@utils/services/priorityLevelService";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { updateTicketById } from "../@utils/services/ticketService";

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const PriorityLevelFragment: React.FC<Props> = ({ ticket, refetch }) => {
  const [query] = useState<Query>({ search: "", offset: 0, limit: 50 });
  const [selectedPriorityLevel, setSelectedPriorityLevel] = useState<
    PriorityLevel | undefined
  >(ticket.priorityLevel);

  const { data: priorityLevelsData } = useQuery({
    queryKey: [`priority-levels-${JSON.stringify(query)}`],
    queryFn: () => getPriorityLevels(query),
  });

  const handleSeverityUpdate = () => {
    if (selectedPriorityLevel)
      updateTicketById(ticket.id, {
        priorityLevelId: selectedPriorityLevel.id,
      })
        .then((response) => {
          console.log(response.status);
          refetch();
        })
        .catch((error) => console.error(error));
  };

  return (
    <div className="flex items-center gap-2">
      <p>Severity:</p>
      <Dropdown
        value={selectedPriorityLevel}
        options={priorityLevelsData?.data.priorityLevels}
        optionLabel="name"
        onChange={(e) => setSelectedPriorityLevel(e.value)}
        pt={{
          header: { className: "" },
          filterInput: { className: "bg-inherit" },
          list: { className: "bg-[#EEEEEE]" },
          item: {
            className: "focus:bg-slate-700 ",
          },
          input: { className: "" },
        }}
        className={`bg-inherit border-slate-400`}
      />
      <Button onClick={handleSeverityUpdate} className="bg-blue-600">
        Update
      </Button>
    </div>
  );
};

export default PriorityLevelFragment;
