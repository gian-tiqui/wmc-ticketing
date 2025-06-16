import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { CustomFile, Ticket } from "../types/types";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { TicketStatus } from "../@utils/enums/enum";
import extractOriginalName from "../@utils/functions/extractOriginalName";
import { Nullable } from "primereact/ts-helpers";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setResolution: Dispatch<SetStateAction<string>>;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
  files: CustomFile[];
  setFiles: Dispatch<SetStateAction<CustomFile[]>>;
  setStatusId: Dispatch<SetStateAction<number>>;
  resolutionTime: Nullable<Date>;
  setResolutionTime: Dispatch<SetStateAction<Nullable<Date>>>;
}

const ResolutionDialog: React.FC<Props> = ({
  visible,
  setVisible,
  setFiles,
  files,
  setResolution,
  setStatusId,
}) => {
  const fileUploadRef = useRef<FileUpload>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  return (
    <Dialog
      visible={visible}
      onHide={() => {
        setVisible(false);
      }}
      className="p-4 w-96 md:w-[500px] md:h-full"
      pt={{
        header: {
          className: "bg-[#EEEEEE] rounded-t-3xl",
        },
        content: {
          className: "bg-[#EEEEEE] pt-5 rounded-b-3xl",
        },
        closeButton: { className: "bg-white" },
        mask: { className: "backdrop-blur" },
      }}
      header="Resolution"
    >
      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">Resolution Details</h4>
          <Button
            className="h-10 gap-2 bg-blue-600"
            type="submit"
            icon={`${PrimeIcons.CHECK_CIRCLE}`}
            onClick={() => setStatusId(TicketStatus.RESOLVED)}
          >
            Resolve
          </Button>
        </div>
        <Divider />
        <InputTextarea
          className="w-full mb-3 bg-white border-black h-52"
          onChange={(e) => setResolution(e.target.value)}
        />

        <h4 className="mt-5 text-lg font-medium">Service Report</h4>
        <Divider />
        <div className="relative">
          <header className="flex items-center justify-between">
            <FileUpload
              ref={fileUploadRef}
              mode="basic"
              pt={{ basicButton: { className: "bg-blue-600" } }}
              accept="application/pdf"
              chooseLabel="Upload file"
              onSelect={(e) => {
                setFiles((prevFiles) => {
                  const existingFileNames = new Set(
                    prevFiles.map((file) => file.file.name)
                  );

                  const newFiles = e.files
                    .filter((file) => !existingFileNames.has(file.name))
                    .map((file) => ({
                      file,
                      preview: URL.createObjectURL(file),
                    }));

                  return [...newFiles, ...prevFiles];
                });

                fileUploadRef.current?.clear();
              }}
              multiple
            />
            <div className="flex items-center gap-2">
              <Button
                icon={`${deleteMode ? PrimeIcons.TIMES : PrimeIcons.TRASH}`}
                onClick={() => setDeleteMode(!deleteMode)}
                className={`${deleteMode ? "" : "bg-red-500"}`}
                tooltip={deleteMode ? "Cancel" : "Delete"}
                tooltipOptions={{ position: "bottom" }}
              />
            </div>
          </header>
          <section
            className={`${scrollbarTheme} flex flex-col gap-2 p-4 mt-4 overflow-y-auto rounded bg-white border-black h-96`}
          >
            {files.map((file, index) => (
              <div key={index} className="relative flex">
                {deleteMode && (
                  <Button
                    icon={PrimeIcons.TIMES}
                    className="absolute z-10 w-10 h-10 p-1 text-white bg-red-500 rounded-full top-2 right-2"
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                    tooltip="Remove"
                    tooltipOptions={{ position: "bottom" }}
                  />
                )}

                <Button
                  icon={`${PrimeIcons.FILE_PDF} text-xl`}
                  className="w-full h-16 gap-2 font-medium text-black bg-white border-none shadow-xl"
                >
                  {extractOriginalName(file.file.name)}
                </Button>
              </div>
            ))}
          </section>
        </div>
      </div>
    </Dialog>
  );
};

export default ResolutionDialog;
