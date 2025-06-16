import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Secrets } from "../types/types";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";

interface Props {
  visible: boolean;
  onHide: Dispatch<SetStateAction<boolean>>;
  secrets?: Secrets;
}

const ClipboardDialog: React.FC<Props> = ({ visible, onHide, secrets }) => {
  const toastRef = useRef<Toast>(null);

  const handleClipboardClicked = () => {
    if (secrets) {
      const textToCopy = `Question: ${secrets.question}\nAnswer: ${secrets.answer}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        toastRef.current?.show({
          severity: "info",
          detail: "Secrets copied to clipboard",
          summary: "Success",
        });
      });
    }
  };

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        className="w-96"
        visible={visible}
        onHide={() => {
          if (visible === true) onHide(false);
        }}
        pt={{
          header: {
            className: "bg-[#EEE] rounded-t-3xl",
          },
          content: {
            className: "bg-[#EEE] rounded-b-3xl",
          },
          root: { className: "rounded-3xl" },
          mask: { className: "backdrop-blur" },
        }}
        header="Your secrets"
      >
        <p className="mb-6">
          Copy your secrets and paste it somewhere incase you need to recover
          your password.
        </p>
        <div
          className="px-4 pb-4 bg-white border rounded hover:cursor-pointer"
          onClick={handleClipboardClicked}
        >
          <div className="flex items-center justify-between w-full py-1 mb-4 border-b">
            <small>Copy to clipboard</small>
            <div className="grid w-8 h-8 rounded place-content-center hover:bg-white">
              <i className={`pi pi-clipboard`}></i>
            </div>
          </div>
          <small>Question</small>
          <p>- {secrets?.question}</p>
          <small>Answer</small>

          <p>- {secrets?.answer}</p>
        </div>
      </Dialog>
    </>
  );
};

export default ClipboardDialog;
