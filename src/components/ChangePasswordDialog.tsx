import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { changePassword } from "../@utils/services/authService";
import handleErrors from "../@utils/functions/handleErrors";
import { useNavigate } from "react-router-dom";
import CustomToast from "./CustomToast";

interface Props {
  visible: boolean;
  onHide: Dispatch<SetStateAction<boolean>>;
  userId: number | undefined;
}

interface FormFields {
  userId: number;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordDialog: React.FC<Props> = ({ onHide, visible, userId }) => {
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
  } = useForm<FormFields>();

  useEffect(() => {
    const setUserId = () => {
      if (userId) setValue("userId", userId);
    };

    setUserId();
  }, [setValue, userId]);

  const accept = async () => {
    const { newPassword, userId } = getValues();

    changePassword(userId, newPassword)
      .then((res) => {
        if (res.status === 201) {
          toastRef.current?.show({
            severity: "info",
            detail: res.data.message,
            summary: "Success",
          });

          onHide(false);
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        }
      })
      .catch((err) => handleErrors(err, toastRef));
  };

  const onSubmit = ({ newPassword, confirmPassword }: FormFields) => {
    if (newPassword !== confirmPassword) {
      toastRef.current?.show({
        severity: "error",
        detail: "Passwords does not match",
        summary: "Error",
      });

      return;
    }

    if (newPassword.length < 8 || confirmPassword.length < 8) {
      toastRef.current?.show({
        severity: "error",
        detail: "Characters must be greater than 8",
        summary: "Error",
      });

      return;
    }

    confirmDialog({
      message: "Do you want to reset your password?",
      header: "Reset Password",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        header="Change Password"
        visible={visible}
        onHide={() => {
          if (visible === true) onHide(false);
        }}
        className="p-4 w-96"
        pt={{
          header: {
            className:
              "bg-slate-900 text-slate-100 border-t border-x border-slate-700",
          },
          content: {
            className:
              "bg-slate-900 text-slate-100 pt-5 border-x border-b border-slate-700",
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="h-24 mb-2">
            <label
              htmlFor="floorCodeInput"
              className="text-sm font-semibold text-blue-400"
            >
              New Password
            </label>
            <IconField id="floorCodeInput" iconPosition="left">
              <InputIcon className={`${PrimeIcons.LOCK}`}></InputIcon>
              <InputText
                {...register("newPassword", { required: true })}
                placeholder="**********"
                type="password"
                className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
              />
            </IconField>
            {errors.newPassword && (
              <small className="flex items-center gap-1 mt-1">
                <i
                  className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                ></i>
                <p className="font-medium text-red-400">
                  New Password is required
                </p>
              </small>
            )}
          </div>
          <div className="h-24 mb-2">
            <label
              htmlFor="floorCodeInput"
              className="text-sm font-semibold text-blue-400"
            >
              Confirm Password
            </label>
            <IconField id="floorCodeInput" iconPosition="left">
              <InputIcon className={`${PrimeIcons.LOCK}`}></InputIcon>
              <InputText
                {...register("confirmPassword", { required: true })}
                placeholder="**********"
                type="password"
                className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
              />
            </IconField>
            {errors.confirmPassword && (
              <small className="flex items-center gap-1 mt-1">
                <i
                  className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                ></i>
                <p className="font-medium text-red-400">Password is required</p>
              </small>
            )}
          </div>
          <Button
            type="submit"
            className="justify-center w-full h-10 gap-2 mt-2 font-medium"
            icon={`${PrimeIcons.PLUS}`}
          >
            Reset Password
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default ChangePasswordDialog;
