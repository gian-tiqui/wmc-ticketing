import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { ChangePassword as ChangePasswordType } from "../types/types";
import { confirmDialog } from "primereact/confirmdialog";
import { changePassword } from "../@utils/services/userService";
import useUserDataStore from "../@utils/store/userDataStore";
import handleErrors from "../@utils/functions/handleErrors";
import CustomToast from "./CustomToast";

const ChangePassword = () => {
  const toastRef = useRef<Toast>(null);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordType>();
  const { user } = useUserDataStore();

  const accept = async () => {
    const { oldPassword, newPassword } = getValues();
    if (user)
      changePassword(user.sub, {
        oldPassword,
        newPassword,
      } as ChangePasswordType)
        .then((response) => {
          if (response.status === 200) {
            toastRef.current?.show({
              severity: "info",
              summary: "Success",
              detail: "Your password has been changed.",
            });
            reset();
          }
        })
        .catch((error) => handleErrors(error, toastRef));
  };

  const handleSaveClicked = (data: ChangePasswordType) => {
    if (data.newPassword != data.confirmNewPassword) {
      toastRef.current?.show({
        severity: "error",
        summary: "Success",
        detail: "New Passwords does not match.",
      });
      return;
    }

    confirmDialog({
      message: "Do you want to update your password?",
      header: "Change Password",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleSaveClicked)}
      className="w-full pt-5 h-80"
    >
      <CustomToast ref={toastRef} />
      <ScrollPanel style={{ height: "calc(72vh - 200px)" }} className="mb-5">
        <div className="flex justify-between w-full">
          <p className="w-full">Old Password</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.LOCK}> </InputIcon>
            <InputText
              {...register("oldPassword", { required: true })}
              placeholder="********"
              type="password"
              className="w-full h-10 bg-inherit text-slate-100"
            />
          </IconField>
          <div className="flex items-center justify-end w-full">
            {errors.oldPassword && (
              <div className="flex items-center gap-2 text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">
                  Old password is required.
                </small>
              </div>
            )}
          </div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full">New Password</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.LOCK}> </InputIcon>
            <InputText
              {...register("newPassword", { required: true })}
              placeholder="********"
              type="password"
              className="w-full h-10 bg-inherit text-slate-100"
            />
          </IconField>
          <div className="flex items-center justify-end w-full">
            {errors.newPassword && (
              <div className="flex items-center gap-2 text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">
                  New password is required.
                </small>
              </div>
            )}
          </div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full">Confirm New Password</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.LOCK}> </InputIcon>
            <InputText
              {...register("confirmNewPassword", { required: true })}
              placeholder="********"
              type="password"
              className="w-full h-10 bg-inherit text-slate-100"
            />
          </IconField>
          <div className="flex items-center justify-end w-full">
            {errors.confirmNewPassword && (
              <div className="flex items-center gap-2 text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">
                  Confirm new password is required.
                </small>
              </div>
            )}
          </div>
        </div>
        <Divider />
      </ScrollPanel>
      <div className="flex justify-end gap-2">
        <Button className="w-52" type="submit" icon={`${PrimeIcons.KEY} mr-2`}>
          Change Password
        </Button>
      </div>
    </form>
  );
};

export default ChangePassword;
