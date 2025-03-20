import React from "react";

interface Props {
  content: string;
  icon: string;
}

const FooterItem: React.FC<Props> = ({ content, icon }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="grid text-gray-100 bg-blue-400 rounded h-7 w-7 place-content-center">
        <i className={icon}></i>
      </div>
      <h4>{content}</h4>
    </div>
  );
};

export default FooterItem;
