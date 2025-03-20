import { Toast } from "primereact/toast";
import { forwardRef } from "react";

interface Props {
  o?: number;
}

const CustomToast = forwardRef<Toast, Props>((_, ref) => {
  return (
    <Toast
      pt={{ content: { className: "bg-slate-800" } }}
      className=""
      ref={ref}
    />
  );
});

export default CustomToast;
