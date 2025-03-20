import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const PageTemplate: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-auto font-sans bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-slate-100">
      {children}
    </div>
  );
};

export default PageTemplate;
