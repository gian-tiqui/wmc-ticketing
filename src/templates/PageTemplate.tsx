import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const PageTemplate: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative overflow-hidden w-full min-h-screen font-sans bg-[#CBD5E1]">
      {children}
    </div>
  );
};

export default PageTemplate;
