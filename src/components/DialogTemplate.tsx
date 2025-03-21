import { Dialog } from "primereact/dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
  header?: ReactNode;
}

const DialogTemplate: React.FC<Props> = ({
  visible,
  setVisible,
  children,
  header,
}) => {
  return (
    <Dialog
      header={header}
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
      className="p-4 w-96 md:w-[500px]"
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
    >
      {children}
    </Dialog>
  );
};

export default DialogTemplate;
