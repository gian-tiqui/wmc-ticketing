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
        header={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Update Department
              </h3>
              <p className="text-sm text-slate-500">
                Edit department information
              </p>
            </div>
          </div>
        }
        visible={visible}
        className="w-[90vw] max-w-2xl max-h-[90vh] md:w-[70vw] lg:w-[60vw] xl:w-[50vw]"
        onHide={() => {
          setVisible(false);
          setId(null);
          reset();
        }}
        pt={{
          headerTitle: { className: "text-sm" },
          header: {
            className:
              "rounded-t-2xl bg-gradient-to-r from-white to-slate-50 border-b border-slate-200/50 p-6",
          },
          root: {
            className:
              "shadow-2xl shadow-slate-300/20 border border-slate-200/50 rounded-2xl overflow-hidden",
          },
          content: {
            className:
              "rounded-b-2xl bg-gradient-to-b from-white to-slate-50/30 p-6",
          },
          mask: {
            className: "backdrop-blur-sm bg-slate-900/10",
          },
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`space-y-6 overflow-auto max-h-[60vh] pr-2 ${scrollbarTheme}`}
        >
          {/* Department Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-green-500 to-blue-600"></div>
              <h4 className="text-sm font-semibold text-slate-700">
                Department Information
              </h4>
            </div>

            {/* Department Name */}
            <div className="space-y-2">
              <label
                htmlFor="nameInput"
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Department Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputText
                  id="nameInput"
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter department name"
                  {...register("name", {
                    required: "Department name is required",
                  })}
                />
                {errors.name && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.081 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.name && (
                <div className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 rounded-lg bg-red-50">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.name.message}
                </div>
              )}
            </div>

            {/* Department Code */}
            <div className="space-y-2">
              <label
                htmlFor="codeInput"
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
                Department Code
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputText
                  id="codeInput"
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter department code"
                  {...register("code", {
                    required: "Department code is required",
                  })}
                />
                {errors.code && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.081 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {errors.code && (
                <div className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 rounded-lg bg-red-50">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.code.message}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200/50">
            <Button
              type="submit"
              className="flex items-center justify-center w-full h-12 gap-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Update Department
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default UpdateDepartmentDialog;
