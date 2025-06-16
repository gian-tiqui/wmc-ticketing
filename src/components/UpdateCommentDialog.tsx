import React, { Dispatch, SetStateAction } from "react";
import { Dialog } from "primereact/dialog";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  commentId: number | null;
}

const UpdateCommentDialog: React.FC<Props> = ({
  commentId,
  visible,
  setVisible,
}) => {
  return (
    <Dialog
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
      pt={{
        header: {
          className:
            "bg-slate-900 text-slate-100 border-t border-x border-slate-700",
        },
        content: {
          className:
            "bg-slate-900 text-slate-100 pt-5 border-x border-b border-slate-700",
        },
        mask: { className: "backdrop-blur" },
      }}
      className="h-96 w-96"
      header="Update comment"
    >
      {commentId}
    </Dialog>
  );
};

export default UpdateCommentDialog;
