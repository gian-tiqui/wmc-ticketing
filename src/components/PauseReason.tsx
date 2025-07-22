import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";
import { useForm } from "react-hook-form";
import { ProgressSpinner } from "primereact/progressspinner";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  pauseReason: string;
  setPauseReason: React.Dispatch<React.SetStateAction<string>>;
  onPause: (reason: string) => void;
  isLoading: boolean;
}

interface FormFields {
  pauseReason: string;
}

const PauseReason: React.FC<Props> = ({
  visible,
  setVisible,
  pauseReason,
  onPause,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>({
    defaultValues: {
      pauseReason: pauseReason || "",
    },
  });

  const onSubmit = (data: FormFields) => {
    onPause(data.pauseReason);
  };

  const onHide = () => {
    reset();
    setVisible(false);
  };

  return (
    <Dialog
      header="Pause Ticket"
      visible={visible}
      onHide={onHide}
      className="w-full max-w-md"
      draggable={false}
      pt={{
        header: {
          className: "bg-gray-50 border-b border-gray-200 rounded-t-lg p-4",
        },
        content: {
          className: "bg-gray-50 p-4 rounded-b-lg",
        },
        closeButton: {
          className: "hover:bg-gray-200",
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="pauseReason"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Reason for pausing
            <span className="text-red-500">*</span>
          </label>
          <InputTextarea
            id="pauseReason"
            {...register("pauseReason", {
              required: "Pause reason is required",
              minLength: {
                value: 10,
                message: "Reason should be at least 10 characters",
              },
            })}
            rows={5}
            className={`w-full ${errors.pauseReason ? "p-invalid" : ""}`}
            autoFocus
            disabled={isLoading}
            pt={{
              root: {
                className: "resize-none",
              },
            }}
          />
          {errors.pauseReason && (
            <small className="block mt-1 p-error">
              {errors.pauseReason.message}
            </small>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            icon={PrimeIcons.TIMES}
            onClick={onHide}
            severity="secondary"
            disabled={isLoading}
            className="px-4 py-2"
          />
          <Button
            type="submit"
            label={isLoading ? "Pausing..." : "Pause Ticket"}
            icon={
              isLoading ? (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="6"
                />
              ) : (
                PrimeIcons.PAUSE
              )
            }
            severity="warning"
            loading={isLoading}
            className="px-4 py-2"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default PauseReason;
