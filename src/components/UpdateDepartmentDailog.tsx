import React, { useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import CustomToast from "./CustomToast";
import { Department } from "../types/types";
import {
  getDepartmentById,
  updateDepartmentById,
} from "../@utils/services/departmentService";
import handleErrors from "../@utils/functions/handleErrors";
import {
  RefetchOptions,
  QueryObserverResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  id: number | null;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<Department>, Error>>;
}

interface FormFields {
  name: string;
  code: string;
}

const UpdateDepartmentDialog: React.FC<Props> = ({
  visible,
  setVisible,
  id,
  setId,
  refetch,
}) => {
  const toastRef = useRef<Toast>(null);

  const { data } = useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormFields>();

  useEffect(() => {
    if (data?.data) {
      console.log(data.data);
      setValue("name", data.data.department.name);
      setValue("code", data.data.department.code);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (!visible) {
      reset();
      setId(null);
    }
  }, [visible, reset, setId]);

  const onSubmit = (formData: FormFields) => {
    updateDepartmentById(id!, formData)
      .then((res) => {
        if (res.status === 200) {
          setVisible(false);
          setId(null);
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
        header={`Update Department`}
        visible={visible}
        className="w-96 h-[60vh]"
        onHide={() => {
          setVisible(false);
          setId(null);
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
          {/* Name */}
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

          {/* Code */}
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
            Update Department
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default UpdateDepartmentDialog;
