import { Button } from "primereact/button";
import React, { useState } from "react";
import NewTicketDialog from "./NewTicketDialog";
import { PrimeIcons } from "primereact/api";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Ticket } from "../types/types";

interface Props {
  refetch: (
    options?: RefetchOptions
  ) => Promise<
    QueryObserverResult<{ tickets: Ticket[]; count: number }, Error>
  >;
}

const NewTicketButton: React.FC<Props> = ({ refetch }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <NewTicketDialog
        visible={visible}
        setVisible={setVisible}
        refetch={refetch}
        header={
          <div className="flex items-center gap-2">
            <i className={`${PrimeIcons.TICKET} text-lg rotate-90`}></i>
            <p>New Ticket</p>
          </div>
        }
      />
      <Button
        onClick={() => {
          if (!visible) setVisible(true);
        }}
        className="gap-2 font-medium h-9"
        icon={`${PrimeIcons.PLUS_CIRCLE}`}
      >
        New Ticket
      </Button>
    </>
  );
};

export default NewTicketButton;
