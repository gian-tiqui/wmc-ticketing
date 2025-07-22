import React, { Dispatch, SetStateAction } from "react";
import { Ticket } from "../types/types";
import { useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
  onClose: (reason: string) => void;
  isLoading: boolean;
}

interface FormFields {
  closingReason: string;
}

const CloseTicketDialog: React.FC<Props> = ({
  visible,
  setVisible,
  onClose,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>();

  const handleCloseTicket = (data: FormFields) => {
    onClose(data.closingReason);
    reset();
  };

  const handleDialogClose = () => {
    setVisible(false);
    reset();
  };

  return (
    <Dialog
      visible={visible}
      onHide={handleDialogClose}
      className="w-[95vw] max-w-xl"
      pt={{
        root: {
          className: "backdrop-blur-xl bg-black/20",
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
          className:
            "w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border-0 transition-all duration-200 shadow-sm hover:shadow-md",
        },
        mask: {
          className: "backdrop-blur-sm bg-black/10",
        },
      }}
      header={
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-br from-red-500 to-pink-600">
            <i className={`${PrimeIcons.LOCK} text-white text-lg`}></i>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Close Ticket
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Provide closure reason and finalize ticket
            </p>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit(handleCloseTicket)} className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            <div className="flex-1 h-px ml-2 bg-slate-200"></div>
            <span className="text-xs font-medium text-slate-500">
              Closure Details Required
            </span>
          </div>

          {/* Closing Reason Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-100 to-red-200">
                <i className={`pi pi-edit text-red-600 text-sm`}></i>
              </div>
              <div>
                <label
                  htmlFor="closingReasonTextarea"
                  className="text-sm font-medium text-slate-700"
                >
                  Closing Reason
                </label>
                <p className="text-xs text-slate-500">
                  Explain why this ticket is being closed
                </p>
              </div>
            </div>

            <div className="relative">
              <InputTextarea
                id="closingReasonTextarea"
                {...register("closingReason", {
                  required: "Closing reason is required",
                  minLength: {
                    value: 10,
                    message: "Please provide at least 10 characters",
                  },
                })}
                className="w-full"
                rows={6}
                placeholder="Enter detailed reason for closing this ticket..."
                disabled={isLoading}
                pt={{
                  root: {
                    className: `w-full border-2 rounded-xl transition-all duration-200 ${
                      errors.closingReason
                        ? "border-red-300 bg-red-50/30"
                        : "border-slate-200 bg-white/80 backdrop-blur-sm hover:border-red-300 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
                    } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`,
                  },
                }}
                style={{
                  padding: "16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#334155",
                  resize: "none",
                }}
              />
              {errors.closingReason && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-sm`}
                  ></i>
                  <span className="text-sm font-medium">
                    {errors.closingReason.message}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Warning Notice */}
          <div className="p-4 border rounded-lg border-amber-200 bg-amber-50">
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <i
                className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-amber-600`}
              ></i>
              <span className="font-medium">Important Notice</span>
            </div>
            <p className="mt-1 text-xs text-amber-600">
              Closing this ticket will mark it as completed and notify all
              stakeholders. This action can be reversed if needed.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-200/50">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl gap-2 font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              icon={isLoading ? undefined : PrimeIcons.LOCK}
              iconPos="right"
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? "Closing Ticket..." : "Close Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default CloseTicketDialog;
