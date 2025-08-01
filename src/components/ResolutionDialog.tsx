import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { CustomFile } from "../types/types";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { InputTextarea } from "primereact/inputtextarea";
import extractOriginalName from "../@utils/functions/extractOriginalName";
import { Nullable } from "primereact/ts-helpers";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  files: CustomFile[];
  setFiles: Dispatch<SetStateAction<CustomFile[]>>;
  resolutionTime: Nullable<Date>;
  setResolutionTime: Dispatch<SetStateAction<Nullable<Date>>>;
  resolution: string;
  setResolution: Dispatch<SetStateAction<string>>;
  onResolve: (data: { resolution: string; resolutionTime?: string }) => void;
  isLoading?: boolean;
}

const ResolutionDialog: React.FC<Props> = ({
  visible,
  setVisible,
  setFiles,
  files,
  resolutionTime,
  resolution,
  setResolution,
  onResolve,
  isLoading = false,
}) => {
  const fileUploadRef = useRef<FileUpload>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  const handleResolve = () => {
    // Validate resolution text
    if (!resolution.trim()) {
      // You might want to show a toast error here
      return;
    }

    const data: { resolution: string; resolutionTime?: string } = {
      resolution: resolution.trim(),
    };

    if (resolutionTime) {
      data.resolutionTime = new Date(resolutionTime).toISOString();
    }

    onResolve(data);
  };

  const handleClose = () => {
    if (isLoading) return;
    setVisible(false);
    setDeleteMode(false);
  };

  return (
    <Dialog
      visible={visible}
      onHide={handleClose}
      className="w-[95vw] max-w-2xl"
      closable={!isLoading}
      pt={{
        root: {
          className: "border-none shadow-none",
        },
        header: {
          className:
            "bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50 rounded-t-2xl p-6 shadow-sm",
        },
        content: {
          className:
            "bg-gradient-to-b from-white to-slate-50/30 rounded-b-2xl p-0 overflow-auto",
        },
        closeButton: {
          className: `
            w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border-0 transition-all duration-200 shadow-sm hover:shadow-md
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          `,
        },
        mask: {
          className: "backdrop-blur-sm",
        },
      }}
      header={
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <i className={`${PrimeIcons.CHECK_CIRCLE} text-white text-lg`}></i>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Ticket Resolution
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Complete and document the resolution
            </p>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <span className="text-sm font-medium text-slate-700">
              Resolution Status
            </span>
          </div>
          <Button
            className={`
              px-6 py-3 rounded-xl font-medium transition-all duration-200 gap-2
              ${
                isLoading || !resolution.trim()
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }
            `}
            disabled={isLoading || !resolution.trim()}
            icon={isLoading ? PrimeIcons.SPINNER : PrimeIcons.CHECK}
            iconPos="left"
            onClick={handleResolve}
            loading={isLoading}
          >
            {isLoading ? "Resolving..." : "Mark as Resolved"}
          </Button>
        </div>

        {/* Resolution Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200">
              <i className={`pi pi-file-edit text-emerald-600 text-sm`}></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Resolution Details *
            </h3>
          </div>

          <div className="relative">
            <InputTextarea
              value={resolution}
              className={`
                w-full min-h-[200px] p-4 border-2 rounded-xl bg-white/80 backdrop-blur-sm 
                transition-all duration-200 resize-none placeholder:text-slate-400 font-medium text-slate-700
                ${
                  !resolution.trim() && !isLoading
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                }
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
              placeholder="Describe the resolution in detail, including steps taken, root cause, and any preventive measures..."
              onChange={(e) => setResolution(e.target.value)}
              disabled={isLoading}
              pt={{
                root: {
                  className: "font-medium text-slate-700",
                },
              }}
            />
            <div className="absolute text-xs bottom-3 right-3 text-slate-400">
              <i className={`${PrimeIcons.INFO_CIRCLE} mr-1`}></i>
              Required field - Be specific and detailed
            </div>
          </div>
        </div>

        {/* Service Report Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
              <i
                className={`${PrimeIcons.FILE_PDF} text-purple-600 text-sm`}
              ></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Service Report (Optional)
            </h3>
          </div>

          {/* File Upload Controls */}
          <div className="flex items-center justify-between p-4 border bg-white/50 rounded-xl border-slate-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <FileUpload
                ref={fileUploadRef}
                mode="basic"
                disabled={isLoading}
                pt={{
                  basicButton: {
                    className: `
                      px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium
                      ${
                        isLoading
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                      }
                    `,
                  },
                }}
                accept="application/pdf"
                chooseLabel="Upload PDF"
                onSelect={(e) => {
                  if (isLoading) return;

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
              <span className="text-sm text-slate-600">
                {files.length} file{files.length !== 1 ? "s" : ""} uploaded
              </span>
            </div>

            {files.length > 0 && (
              <Button
                icon={deleteMode ? PrimeIcons.TIMES : PrimeIcons.TRASH}
                onClick={() => !isLoading && setDeleteMode(!deleteMode)}
                disabled={isLoading}
                className={`
                  w-10 h-10 rounded-lg transition-all duration-200 shadow-sm
                  ${
                    isLoading
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : deleteMode
                      ? "bg-slate-200 hover:bg-slate-300 text-slate-600"
                      : "bg-red-500 hover:bg-red-600 text-white hover:shadow-md"
                  }
                `}
                tooltip={deleteMode ? "Cancel delete mode" : "Delete files"}
                tooltipOptions={{ position: "top" }}
              />
            )}
          </div>

          {/* Files List */}
          <div
            className={`
              ${scrollbarTheme} 
              max-h-80 overflow-y-auto space-y-3 p-4 
              bg-gradient-to-br from-white/60 to-slate-50/40 
              rounded-xl border border-slate-200/50 backdrop-blur-sm
              ${
                files.length === 0
                  ? "flex items-center justify-center min-h-[200px]"
                  : ""
              }
              ${isLoading ? "opacity-50" : ""}
            `}
          >
            {files.length === 0 ? (
              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                  <i
                    className={`${PrimeIcons.CLOUD_UPLOAD} text-slate-400 text-2xl`}
                  ></i>
                </div>
                <div>
                  <p className="font-medium text-slate-600">
                    No files uploaded yet
                  </p>
                  <p className="text-sm text-slate-500">
                    Upload PDF documents to complete the service report
                  </p>
                </div>
              </div>
            ) : (
              files.map((file, index) => (
                <div key={index} className="relative group">
                  {deleteMode && !isLoading && (
                    <Button
                      icon={PrimeIcons.TIMES}
                      className="absolute z-10 w-8 h-8 p-1 text-white transition-all duration-200 bg-red-500 rounded-full shadow-lg opacity-0 hover:bg-red-600 top-2 right-2 group-hover:opacity-100"
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== index))
                      }
                      tooltip="Remove file"
                      tooltipOptions={{ position: "top" }}
                    />
                  )}

                  <div className="flex items-center gap-4 p-4 transition-all duration-200 border bg-white/80 rounded-xl border-slate-200/50 backdrop-blur-sm hover:bg-white/90 hover:border-slate-300/50 group-hover:shadow-md">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200">
                      <i
                        className={`${PrimeIcons.FILE_PDF} text-red-600 text-lg`}
                      ></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-slate-900">
                        {extractOriginalName(file.file.name)}
                      </p>
                      <p className="text-sm text-slate-500">
                        PDF Document •{" "}
                        {(file.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-600">
                        Ready
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8">
                <div className="w-full h-full border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Resolving ticket...
              </p>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ResolutionDialog;
