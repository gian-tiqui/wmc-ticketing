import { Dialog } from "primereact/dialog";
import React from "react";

interface Props {
  visible: boolean;
  setVisible: (val: boolean) => void;
}

const CreateCategoryDialog: React.FC<Props> = ({ visible, setVisible }) => {
  return (
    <Dialog
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
    ></Dialog>
  );
};

export default CreateCategoryDialog;
