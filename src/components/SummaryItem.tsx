import React from "react";
import { SummaryCardType } from "../types/types";

const SummaryItem: React.FC<SummaryCardType> = ({ icon, summary, details }) => {
  return (
    <div className="flex w-full h-20 bg-[#EEEEEE] rounded-lg shadow h-18 hover:shadow-blue-900">
      <div className="w-5 h-full bg-blue-500 rounded-s-lg"></div>
      <div className="flex flex-col justify-between p-4">
        <div className="flex items-center gap-2">
          <i className={icon}></i>
          <p className="text-sm">{summary}</p>
        </div>
        <p className="text-sm font-medium">{details}</p>
      </div>
    </div>
  );
};

export default SummaryItem;
