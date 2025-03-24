import React from "react";
import { Ticket } from "../types/types";
import { PrimeIcons } from "primereact/api";
import UserDetails from "./UserDetails";
import { InputTextarea } from "primereact/inputtextarea";

interface Props {
  ticket: Ticket;
}

const RequestDetails: React.FC<Props> = ({ ticket }) => {
  return (
    <div className="w-full rounded-lg shadow h-90 hover:shadow-blue-900 bg-slate-900">
      <div className="h-[5%] bg-blue-500 rounded-t-lg"></div>

      <div className="flex flex-col gap-2 mx-4">
        <h4 className="flex items-center gap-2 mt-4 mb-4 first:font-medium">
          <i className={`${PrimeIcons.INFO_CIRCLE}`}></i>Request Details
        </h4>
        <div className="flex items-center justify-between">
          <UserDetails user={ticket.issuer} />

          <i className={`${PrimeIcons.ARROW_CIRCLE_RIGHT} text-xl`}></i>
          <UserDetails user={ticket.assignedUser} />
        </div>
      </div>

      <h4 className="flex items-center gap-2 mx-4 mt-5 mb-4 font-medium">
        <i className={`${PrimeIcons.INFO_CIRCLE}`}></i>
        Ticket Description
      </h4>
      <InputTextarea
        value={ticket.description}
        className="w-[93%] mx-4 h-40 bg-slate-800 text-slate-100 disabled:opacity-100 disabled:text-slate-100"
        disabled
      />
    </div>
  );
};

export default RequestDetails;
