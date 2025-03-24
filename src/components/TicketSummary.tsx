import { PrimeIcons } from "primereact/api";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";
import RequestorDetails from "./RequestorDetails";
import { Ticket } from "../types/types";

interface Props {
  ticket: Ticket;
}

const TicketSummary: React.FC<Props> = ({ ticket }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex w-full h-20 rounded-lg shadow h-18 hover:shadow-blue-900 bg-slate-900">
            <div className="w-5 h-full bg-blue-500 rounded-s-lg"></div>
            <div className="flex flex-col justify-between p-4">
              <i className={PrimeIcons.CHECK_CIRCLE}></i>
              <p className="font-medium">Status: {ticket.status.type}</p>
            </div>
          </div>
          <div className="flex w-full h-20 rounded-lg shadow h-18 hover:shadow-blue-900 bg-slate-900">
            <div className="w-5 h-full bg-blue-500 rounded-s-lg"></div>
            <div className="flex flex-col justify-between p-4">
              <i className={PrimeIcons.CALENDAR}></i>
              <p className="font-medium">Status: {ticket.status.type}</p>
            </div>
          </div>{" "}
          <div className="flex w-full h-20 rounded-lg shadow h-18 hover:shadow-blue-900 bg-slate-900">
            <div className="w-5 h-full bg-blue-500 rounded-s-lg"></div>
            <div className="flex flex-col justify-between p-4">
              <i className={PrimeIcons.CHECK_CIRCLE}></i>
              <p className="font-medium">Status: {ticket.status.type}</p>
            </div>
          </div>{" "}
          <div className="flex w-full h-20 rounded-lg shadow h-18 hover:shadow-blue-900 bg-slate-900">
            <div className="w-5 h-full bg-blue-500 rounded-s-lg"></div>
            <div className="flex flex-col justify-between p-4">
              <i className={PrimeIcons.CHECK_CIRCLE}></i>
              <p className="font-medium">Status: {ticket.status.type}</p>
            </div>
          </div>{" "}
        </div>
        <div className="h-48 rounded-lg shadow bg-slate-900 hover:shadow-blue-900">
          <div className="h-[5%] bg-blue-500 rounded-t-lg"></div>
          <h4 className="flex items-center gap-2 mx-4 mt-2 mb-4 text-xl font-medium">
            <i className={`${PrimeIcons.INFO_CIRCLE} text-xl`}></i>
            Ticket Description
          </h4>
          <InputTextarea
            value={ticket.description}
            className="w-[93%] mx-4 h-28 bg-slate-800 text-slate-100 disabled:opacity-100 disabled:text-slate-100"
            disabled
          />
        </div>
      </div>

      <RequestorDetails ticket={ticket} />
    </div>
  );
};

export default TicketSummary;
