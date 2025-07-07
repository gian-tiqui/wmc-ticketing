import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { getUser, updateUserById } from "../@utils/services/userService";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Department, Query, User } from "../types/types";
import { getDepartments } from "../@utils/services/departmentService";
import handleErrors from "../@utils/functions/handleErrors";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import { AxiosResponse } from "axios";
import { getRoles } from "../@utils/services/roleService";
import { UserFormData } from "./AddUserDialog";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  id: number | null;
  setId: Dispatch<SetStateAction<number | null>>;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<User>, Error>>;
}

export interface Role {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const UpdateUserDialog: React.FC<Props> = ({
  visible,
  setVisible,
  id,
  setId,
  refetch,
}) => {
  const toastRef = useRef<Toast>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [query] = useState<Query>({ offset: 0, limit: 100 });

  const { data } = useQuery({
    queryKey: [`update-user-${id}`],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

  const { data: departmentsData } = useQuery({
    queryKey: [`departments-${query}-update-user`],
    queryFn: () => getDepartments(query),
    enabled: !!id,
  });

  const { data: rolesData } = useQuery({
    queryKey: [`roles-update-user`],
    queryFn: () => getRoles(),
    enabled: !!id,
  });

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
  } = useForm<UserFormData>();

  const updateUser = (formData: UserFormData) => {
    const payload = {
      ...formData,
      roleNames: selectedRoles.map((role) => role.name),
    };

    updateUserById(id, payload)
      .then((res) => {
        if (res.status === 200) {
          setVisible(false);
          setSelectedDepartment(undefined);
          setSelectedRoles([]);
          reset();
          if (refetch) refetch();
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  useEffect(() => {
    if (selectedDepartment) {
      setValue("deptId", parseInt(selectedDepartment.id.toString(), 10), {
        shouldValidate: true,
      });
    }
  }, [selectedDepartment, setValue]);

  useEffect(() => {
    if (data?.data.user) {
      const user = data.data.user;
      setValue("firstName", user.firstName);
      setValue("middleName", user.middleName);
      setValue("lastName", user.lastName);
      setValue("deptId", parseInt(user.department.id));
      setSelectedDepartment(user.department);
      setSelectedRoles(user.roles);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (!visible) {
      reset();
      setId(null);
      setSelectedRoles([]);
    }
  }, [visible, reset, setId]);

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        header={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl">
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
                Edit User Profile
              </h3>
              <p className="text-sm text-slate-500">
                Update {data?.data.user.firstName}'s information
              </p>
            </div>
          </div>
        }
        visible={visible}
        className="w-[90vw] max-w-2xl max-h-[90vh] md:w-[80vw] lg:w-[60vw] xl:w-[50vw]"
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
          onSubmit={handleSubmit(updateUser)}
          className={`space-y-6 overflow-auto max-h-[60vh] pr-2 ${scrollbarTheme}`}
        >
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-blue-600"></div>
              <h4 className="text-sm font-semibold text-slate-700">
                Personal Information
              </h4>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label
                htmlFor="firstNameInput"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                First Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputText
                  id="firstNameInput"
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Enter first name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
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
              {errors.firstName && (
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
                  {errors.firstName.message}
                </div>
              )}
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <label
                htmlFor="middleNameInput"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Middle Name
              </label>
              <InputText
                id="middleNameInput"
                className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter middle name (optional)"
                {...register("middleName")}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label
                htmlFor="lastNameInput"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Last Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputText
                  id="lastNameInput"
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Enter last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
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
              {errors.lastName && (
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
                  {errors.lastName.message}
                </div>
              )}
            </div>
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
              <h4 className="text-sm font-semibold text-slate-700">
                Account Information
              </h4>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label
                htmlFor="departmentDropdown"
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
                Department
              </label>
              <Dropdown
                id="departmentDropdown"
                options={departmentsData}
                onChange={(e) => setSelectedDepartment(e.value)}
                value={selectedDepartment}
                optionLabel="name"
                placeholder="Select a department"
                className="w-full text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.deptId && (
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
                  {errors.deptId.message}
                </div>
              )}
            </div>

            {/* Roles */}
            <div className="space-y-2">
              <label
                htmlFor="rolesDropdown"
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                User Roles
              </label>
              <MultiSelect
                id="rolesDropdown"
                options={rolesData?.data.roles ?? []}
                value={selectedRoles}
                onChange={(e) => setSelectedRoles(e.value)}
                optionLabel="name"
                placeholder="Select user roles"
                className="w-full text-sm transition-all duration-200 shadow-sm bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                display="chip"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200/50">
            <Button
              type="submit"
              className="flex items-center justify-center w-full h-12 gap-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-xl shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Update User Profile
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default UpdateUserDialog;
