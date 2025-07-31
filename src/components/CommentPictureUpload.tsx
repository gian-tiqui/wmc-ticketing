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
          className: "border-t border-x border-slate-700",
          style: { backgroundColor: "#CBD5E1", color: "#333" },
        },
        content: {
          className: "pt-5 border-x border-b border-slate-700",
          style: { backgroundColor: "#EEEEEE", color: "#333" },
        },
        closeButton: {
          className: "text-slate-700 hover:bg-slate-300",
        },
        mask: { className: "backdrop-blur" },
      }}
      header="Upload Photos"
    >
      <div className="relative" style={{ backgroundColor: "#EEEEEE" }}>
        <header className="flex items-center justify-between mb-4">
          <FileUpload
            ref={fileUploadRef}
            accept="image/*"
            mode="basic"
            chooseLabel="Choose Files"
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
            pt={{
              chooseButton: {
                className: "hover:opacity-80 border-slate-400",
                style: { backgroundColor: "#CBD5E1", color: "#333" },
              },
            }}
          />
          <div className="flex items-center gap-2">
            <Button
              icon={`${deleteMode ? PrimeIcons.TIMES : PrimeIcons.TRASH}`}
              onClick={() => setDeleteMode(!deleteMode)}
              className="border-0 hover:opacity-80"
              style={{
                backgroundColor: deleteMode ? "#EEEEEE" : "#CBD5E1",
                color: "#333",
              }}
              tooltip={deleteMode ? "Cancel" : "Delete Mode"}
              tooltipOptions={{
                position: "bottom",
                pt: {
                  root: {
                    className: "border border-slate-300",
                    style: { backgroundColor: "#CBD5E1", color: "#333" },
                  },
                  text: {
                    style: { color: "#333" },
                  },
                },
              }}
            />
          </div>
        </header>

        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <i className="mb-2 text-4xl pi pi-image"></i>
            <p className="text-sm">No images selected</p>
          </div>
        ) : (
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {deleteMode && (
                  <Button
                    icon={PrimeIcons.TIMES}
                    className="absolute z-10 w-8 h-8 p-1 text-white border-0 rounded-full shadow-lg top-2 right-2 hover:opacity-80"
                    style={{ backgroundColor: "#CBD5E1" }}
                    onClick={() =>
                      setFiles(files.filter((_, i) => i !== index))
                    }
                    tooltip="Remove"
                    tooltipOptions={{
                      position: "bottom",
                      pt: {
                        root: {
                          className: "border border-slate-300",
                          style: { backgroundColor: "#CBD5E1", color: "#333" },
                        },
                        text: {
                          style: { color: "#333" },
                        },
                      },
                    }}
                  />
                )}
                <div className="relative overflow-hidden transition-colors border rounded-md border-slate-300 hover:border-slate-400">
                  <Image
                    src={file.preview}
                    alt={file.file.name}
                    className="object-cover w-full h-32"
                    preview
                    pt={{
                      image: {
                        className: "transition-transform group-hover:scale-105",
                      },
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-2"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(203, 213, 225, 0.9), transparent)",
                    }}
                  >
                    <p className="text-xs font-medium truncate text-slate-700">
                      {file.file.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </Dialog>
  );
};

export default CommentPictureUpload;
