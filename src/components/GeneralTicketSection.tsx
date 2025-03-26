import { Divider } from "primereact/divider";
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
    <form
      className="flex flex-col mb-6"
      onSubmit={handleSubmit(handleTicketDetailsUpdate)}
    >
      <CustomToast ref={toastRef} />
      <h4 className="text-lg font-medium">General</h4>
      <Divider />
      <label htmlFor="ticketNameInput" className="text-sm font-medium">
        Ticket Name
      </label>
      <InputText
        {...register("title")}
        id="ticketNameInput"
        className="mb-6 w-96 bg-slate-700 text-slate-100"
      />

      <label htmlFor="ticketDescription" className="text-sm font-medium">
        Ticket Description
      </label>
      <InputTextarea
        {...register("description")}
        id="ticketDescription"
        className="mb-6 w-96 h-52 bg-slate-700 text-slate-100"
      />
      <Button
        type="submit"
        className="w-96"
        disabled={!isDirty || isLoading}
        loading={isLoading}
      >
        Update
      </Button>
    </form>
  );
};

export default GeneralTicketSection;
