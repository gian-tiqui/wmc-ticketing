import { Button } from "primereact/button";
import React, { useState } from "react";
import NewTicketDialog from "./NewTicketDialog";
import { PrimeIcons } from "primereact/api";

interface Props {
  refetchAll: () => void;
}

const NewTicketButton: React.FC<Props> = ({ refetchAll }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <NewTicketDialog
        visible={visible}
        setVisible={setVisible}
        refetch={refetchAll}
        header={<p className="text-md">New Ticket</p>}
      />
      <Button
        onClick={() => {
          if (!visible) setVisible(true);
        }}
        className="w-8 h-8 font-medium bg-blue-600"
        icon={`${PrimeIcons.PLUS_CIRCLE}`}
        tooltip="New Ticket"
        tooltipOptions={{ position: "left" }}
      ></Button>
    </>
  );
};

export default NewTicketButton;
