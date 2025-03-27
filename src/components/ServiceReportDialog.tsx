import { Dispatch, SetStateAction } from "react";
import { Dialog } from "primereact/dialog";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const ServiceReportDialog: React.FC<Props> = ({ visible, setVisible }) => {
  return (
    <Dialog
      visible={visible}
      onHide={() => {
        setVisible(false);
      }}
      className="p-4 w-96 md:w-full md:h-full"
      pt={{
        header: {
          className:
            "bg-blue-500 text-slate-100 border-t border-x border-slate-700",
        },
        content: {
          className:
            "bg-slate-900 text-slate-100 pt-5 border-x border-slate-700",
        },
        closeButton: { className: "bg-white" },
      }}
      header="Upload Service Report"
    ></Dialog>
  );
};

export default ServiceReportDialog;
