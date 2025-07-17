import React, { useRef, useState } from "react";
import { Ticket } from "../types/types";
import { InputText } from "primereact/inputtext";
import { useForm, SubmitHandler } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { updateTicketById } from "../@utils/services/ticketService";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import { PrimeIcons } from "primereact/api";

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

interface FormFields {
  title: string;
  description: string;
}

const GeneralTicketSection: React.FC<Props> = ({ ticket, refetch }) => {
  const toastRef = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FormFields>({
    defaultValues: {
      title: ticket?.title || "",
      description: ticket?.description || "",
    },
  });

  const handleTicketDetailsUpdate: SubmitHandler<FormFields> = async (data) => {
    setIsLoading(true);
    try {
      const response = await updateTicketById(ticket.id, {
        title: data.title,
        description: data.description,
      });

      if (response.status === 200) {
        toastRef.current?.show({
          summary: "Ticket Updated Successfully.",
          severity: "success",
        });
        refetch();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Update failed:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
      toastRef.current?.show({
        summary: "Ticket Update Failed.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-3 mx-auto sm:p-4 md:p-6">
      <CustomToast ref={toastRef} />

      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50">
            <i
              className={`${PrimeIcons.COG} text-blue-600 text-base sm:text-lg`}
            ></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            General Settings
          </h2>
        </div>
        <p className="text-xs text-gray-600 sm:text-sm">
          Update your ticket details and configuration preferences
        </p>
      </div>

      {/* Settings Card */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
        <form onSubmit={handleSubmit(handleTicketDetailsUpdate)}>
          {/* Card Header */}
          <div className="px-3 py-3 border-b border-gray-200 sm:px-4 md:px-6 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <i
                  className={`${PrimeIcons.TICKET} text-gray-600 text-sm sm:text-base`}
                ></i>
                <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                  Ticket Information
                </h3>
              </div>
              {isDirty && (
                <div className="flex items-center gap-2 text-xs text-amber-600 sm:text-sm">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-xs`}
                  ></i>
                  <span>Unsaved changes</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-3 space-y-4 sm:p-4 md:p-6 sm:space-y-6">
            {/* Ticket Name Section */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <i
                  className={`${PrimeIcons.TAG} text-gray-500 text-xs sm:text-sm`}
                ></i>
                <label
                  htmlFor="ticketNameInput"
                  className="text-xs font-semibold text-gray-700 sm:text-sm"
                >
                  Ticket Name
                </label>
              </div>
              <InputText
                {...register("title")}
                id="ticketNameInput"
                placeholder="Enter ticket name..."
                className="w-full p-2 text-sm transition-all duration-200 border border-gray-300 rounded-lg sm:p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white"
                pt={{
                  root: {
                    className: "w-full",
                  },
                }}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Description Section */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <i
                  className={`${PrimeIcons.ALIGN_LEFT} text-gray-500 text-xs sm:text-sm`}
                ></i>
                <label
                  htmlFor="ticketDescription"
                  className="text-xs font-semibold text-gray-700 sm:text-sm"
                >
                  Description
                </label>
              </div>
              <InputTextarea
                {...register("description")}
                id="ticketDescription"
                placeholder="Provide a detailed description of the ticket..."
                rows={4}
                className="w-full p-2 text-sm transition-all duration-200 border border-gray-300 rounded-lg resize-none sm:p-3 sm:rows-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white"
                pt={{
                  root: {
                    className: "w-full",
                  },
                }}
              />
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex flex-col items-stretch gap-3 px-3 py-3 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between sm:px-4 md:px-6 sm:py-4 bg-gray-50">
            <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
              <i className={`${PrimeIcons.INFO_CIRCLE} text-xs`}></i>
              <span className="hidden sm:inline">
                Changes are saved automatically when you click Update
              </span>
              <span className="sm:hidden">Auto-save on update</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {isDirty && (
                <Button
                  type="button"
                  text
                  className="text-xs text-gray-600 transition-colors duration-200 sm:text-sm hover:text-gray-800"
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className={`px-4 py-2 text-xs sm:text-sm sm:px-6 rounded-lg font-medium transition-all duration-200 ${
                  isDirty && !isLoading
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isDirty || isLoading}
                loading={isLoading}
                icon={isLoading ? undefined : PrimeIcons.CHECK}
                pt={{
                  root: {
                    className: "flex items-center gap-2",
                  },
                }}
              >
                <span className="hidden sm:inline">
                  {isLoading ? "Updating..." : "Update Settings"}
                </span>
                <span className="sm:hidden">
                  {isLoading ? "Saving..." : "Update"}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Additional Info Card */}
      <div className="p-3 mt-4 border border-blue-200 rounded-lg sm:p-4 sm:mt-6 bg-blue-50">
        <div className="flex items-start gap-2 sm:gap-3">
          <i
            className={`pi pi-lightbulb text-blue-600 mt-0.5 text-sm sm:text-base`}
          ></i>
          <div>
            <h4 className="mb-1 text-xs font-semibold text-blue-900 sm:text-sm">
              Pro Tip
            </h4>
            <p className="text-xs text-blue-700 sm:text-sm">
              Keep your ticket names concise but descriptive. A good description
              helps team members understand the context quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTicketSection;
