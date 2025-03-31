import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { CustomFile } from "../types/types";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  files: CustomFile[];
  setFiles: Dispatch<SetStateAction<CustomFile[]>>;
}

const CommentPictureUpload: React.FC<Props> = ({
  visible,
  setVisible,
  files,
  setFiles,
}) => {
  const fileUploadRef = useRef<FileUpload>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

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
      header="Upload Photos"
    >
      <div className="relative ">
        <header className="flex items-center justify-between">
          <FileUpload
            ref={fileUploadRef}
            accept="image/*"
            mode="basic"
            chooseLabel="Choose"
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
        <section className="grid grid-cols-2 gap-2 mt-4 md:grid-cols-3">
          {files.map((file, index) => (
            <div key={index} className="relative">
              {deleteMode && (
                <Button
                  icon={PrimeIcons.TIMES}
                  className="absolute w-10 h-10 p-1 text-white bg-red-500 rounded-full top-2 right-2"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  tooltip="Remove"
                  tooltipOptions={{ position: "bottom" }}
                />
              )}
              <Image
                src={file.preview}
                alt={file.file.name}
                className="object-cover w-full h-32 rounded-md"
              />
            </div>
          ))}
        </section>
      </div>
    </Dialog>
  );
};

export default CommentPictureUpload;
