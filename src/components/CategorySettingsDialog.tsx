import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { findCategoryById } from "../@utils/services/categoryService";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  categoryId: number | undefined;
}

const CategorySettingsDialog: React.FC<Props> = ({
  setVisible,
  visible,
  categoryId,
}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`category-${categoryId}`],
    queryFn: () => findCategoryById(categoryId),
    enabled: !!categoryId && categoryId !== undefined && categoryId > 0,
  });

  if (isError) {
    console.error(error);
  }

  return (
    <Dialog
      header={`Category Settings`}
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
      }}
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
    >
      {isLoading && <span className="text-sm">Category data loading...</span>}
      {isError && (
        <span className="text-sm">
          There was a problem in loading the data. Try again later.
        </span>
      )}
      {data?.data.category && <div>{JSON.stringify(data?.data.category)}</div>}
    </Dialog>
  );
};

export default CategorySettingsDialog;
