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
        header={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
              <i className={`${PrimeIcons.PLUS} text-white text-lg`}></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                New Ticket
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Create a new support request
              </p>
            </div>
          </div>
        }
      />

      <Button
        onClick={() => {
          if (!visible) setVisible(true);
        }}
        className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 border-0"
        icon={`${PrimeIcons.PLUS} text-sm`}
        tooltip="Create New Ticket"
        tooltipOptions={{ position: "bottom" }}
      />
    </>
  );
};

export default NewTicketButton;
