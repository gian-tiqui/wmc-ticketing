import { Dialog } from "primereact/dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  visible: boolean;
  setVisible: (
    val: boolean
  ) =>
    | void
    | Dispatch<SetStateAction<boolean>>
    | Dispatch<SetStateAction<boolean>>;
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
        root: { className: "shadow-none" },
        header: {
          className: "bg-[#EEEEEE] rounded-t-3xl",
        },
        content: {
          className:
            "bg-[#EEEEEE] pt-5 rounded-b-3xl scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400",
        },
        mask: { className: "backdrop-blur" },

        closeButton: { className: "bg-white" },
        headerTitle: { className: "text-sm" },
      }}
    >
      {children}
    </Dialog>
  );
};

export default DialogTemplate;
