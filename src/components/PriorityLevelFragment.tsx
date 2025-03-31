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
          console.log(response.data);
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
          header: { className: "bg-slate-800" },
          filterInput: { className: "bg-inherit text-slate-100" },
          list: { className: "bg-slate-800" },
          item: {
            className: "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
          },
          input: { className: "text-slate-100" },
        }}
        className={`bg-inherit border-slate-400`}
      />
      <Button onClick={handleSeverityUpdate}>Update</Button>
    </div>
  );
};

export default PriorityLevelFragment;
