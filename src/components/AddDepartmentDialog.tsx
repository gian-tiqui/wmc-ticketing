import React, { useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import CustomToast from "./CustomToast";
import { Department } from "../types/types";
import { createDepartment } from "../@utils/services/departmentService";
import handleErrors from "../@utils/functions/handleErrors";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Department>, Error>>;
}

interface FormFields {
  name: string;
  code: string;
}

const AddDepartmentDialog: React.FC<Props> = ({
  visible,
  setVisible,
  refetch,
}) => {
  const toastRef = useRef<Toast>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>();

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const onSubmit = (formData: FormFields) => {
    createDepartment(formData)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setVisible(false);
          reset();
          if (refetch) refetch();
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        header="Create Department"
        visible={visible}
        className="w-96 h-[60vh]"
        onHide={() => {
          setVisible(false);
          reset();
        }}
        pt={{
          headerTitle: { className: "text-sm" },
          header: { className: "rounded-t-3xl bg-[#EEEEEE]" },
          root: { className: "shadow-none" },
          content: { className: "rounded-b-3xl bg-[#EEEEEE] overflow-hidden" },
          mask: { className: "backdrop-blur" },
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`overflow-auto h-[45vh] ${scrollbarTheme}`}
        >
          {/* Department Name */}
          <div className="h-24">
            <label htmlFor="nameInput" className="text-xs font-medium">
              Department Name
            </label>
            <InputText
              id="nameInput"
              className="w-full h-12 px-3 text-sm border-black"
              {...register("name", { required: "Department name is required" })}
            />
            {errors.name && (
              <span className="text-xs text-red-600">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Department Code */}
          <div className="h-24">
            <label htmlFor="codeInput" className="text-xs font-medium">
              Department Code
            </label>
            <InputText
              id="codeInput"
              className="w-full h-12 px-3 text-sm border-black"
              {...register("code", { required: "Department code is required" })}
            />
            {errors.code && (
              <span className="text-xs text-red-600">
                {errors.code.message}
              </span>
            )}
          </div>

          <Button className="justify-center w-full h-12 mt-2 text-sm bg-blue-600">
            Create Department
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default AddDepartmentDialog;
