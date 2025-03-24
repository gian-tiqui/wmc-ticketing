import React from "react";
import { Ticket } from "../types/types";
import { PrimeIcons } from "primereact/api";

interface Props {
  ticket: Ticket;
}

const RequestorDetails: React.FC<Props> = ({ ticket }) => {
  return (
    <div className="w-full rounded-lg shadow h-90 hover:shadow-blue-900 bg-slate-900">
      <div className="h-[5%] bg-blue-500 rounded-t-lg"></div>

      <h4 className="flex items-center gap-2 mx-4 mt-4 text-xl font-medium">
        <i className={`${PrimeIcons.INFO_CIRCLE} text-xl`}></i>Requestor Details
      </h4>
    </div>
  );
};

export default RequestorDetails;
