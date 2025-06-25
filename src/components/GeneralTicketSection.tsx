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
    <div className="max-w-4xl p-6 mx-auto">
      <CustomToast ref={toastRef} />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-50">
            <i className={`${PrimeIcons.COG} text-blue-600 text-lg`}></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>
        </div>
        <p className="text-sm text-gray-600">
          Update your ticket details and configuration preferences
        </p>
      </div>

      {/* Settings Card */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <form onSubmit={handleSubmit(handleTicketDetailsUpdate)}>
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className={`${PrimeIcons.TICKET} text-gray-600`}></i>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ticket Information
                </h3>
              </div>
              {isDirty && (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-xs`}
                  ></i>
                  <span>Unsaved changes</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-6">
            {/* Ticket Name Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <i className={`${PrimeIcons.TAG} text-gray-500 text-sm`}></i>
                <label
                  htmlFor="ticketNameInput"
                  className="text-sm font-semibold text-gray-700"
                >
                  Ticket Name
                </label>
              </div>
              <InputText
                {...register("title")}
                id="ticketNameInput"
                placeholder="Enter ticket name..."
                className="w-full p-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white"
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
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <i
                  className={`${PrimeIcons.ALIGN_LEFT} text-gray-500 text-sm`}
                ></i>
                <label
                  htmlFor="ticketDescription"
                  className="text-sm font-semibold text-gray-700"
                >
                  Description
                </label>
              </div>
              <InputTextarea
                {...register("description")}
                id="ticketDescription"
                placeholder="Provide a detailed description of the ticket..."
                rows={6}
                className="w-full p-3 transition-all duration-200 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white"
                pt={{
                  root: {
                    className: "w-full",
                  },
                }}
              />
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <i className={`${PrimeIcons.INFO_CIRCLE} text-xs`}></i>
              <span>Changes are saved automatically when you click Update</span>
            </div>

            <div className="flex items-center gap-3">
              {isDirty && (
                <Button
                  type="button"
                  text
                  className="text-gray-600 transition-colors duration-200 hover:text-gray-800"
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
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
                {isLoading ? "Updating..." : "Update Settings"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Additional Info Card */}
      <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
        <div className="flex items-start gap-3">
          <i className={`${"pi pi-lightbulb"} text-blue-600 mt-0.5`}></i>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-blue-900">
              Pro Tip
            </h4>
            <p className="text-sm text-blue-700">
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
