import {
  RefetchOptions,
  QueryObserverResult,
  useQuery,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { User, Department, Query } from "../types/types";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import handleErrors from "../@utils/functions/handleErrors";
import { getDepartments } from "../@utils/services/departmentService";
import { createUser } from "../@utils/services/userService";
import CustomToast from "./CustomToast";
import { getRoles } from "../@utils/services/roleService";

interface Props {
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AxiosResponse<User>, Error>>;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export interface Role {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  deptId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  localNumber: string;
  username: string;
  email: string;
  roleNames: string[];
}

const AddUserDialog: React.FC<Props> = ({ refetch, visible, setVisible }) => {
  const toastRef = useRef<Toast>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const [query] = useState<Query>({ offset: 0, limit: 100 });
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  const { data: rolesData } = useQuery({
    queryKey: ["roles-create-user"],
    queryFn: () => getRoles(),
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["departments-create-user"],
    queryFn: () => getDepartments(query),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormData>();

  useEffect(() => {
    if (selectedRoles.length > 0) {
      console.log(selectedRoles);
    }
  }, [selectedRoles]);

  const handleCreateUser = (formData: UserFormData) => {
    const payload = {
      ...formData,
      roleNames: selectedRoles.map((role) => role.name),
    };

    createUser(payload)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setVisible(false);
          reset();
          setSelectedDepartment(undefined);
          setSelectedRoles([]);
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
    if (!visible) {
      reset();
      setSelectedDepartment(undefined);
      setSelectedRoles([]);
    }
  }, [visible, reset]);

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        header={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Create New User
              </h3>
              <p className="text-sm text-slate-500">
                Add a new team member to your organization
              </p>
            </div>
          </div>
        }
        visible={visible}
        className="w-[90vw] max-w-4xl max-h-[90vh] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]"
        onHide={() => setVisible(false)}
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
          onSubmit={handleSubmit(handleCreateUser)}
          className={`space-y-6 overflow-auto max-h-[60vh] pr-2 ${scrollbarTheme}`}
        >
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
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
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
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
                className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
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
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
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

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-green-500 to-blue-500"></div>
              <h4 className="text-sm font-semibold text-slate-700">
                Contact Information
              </h4>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="emailInput"
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
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Address
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputText
                  id="emailInput"
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
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
              {errors.email && (
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
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Local Number */}
            <div className="space-y-2">
              <label
                htmlFor="localNumberInput"
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Local Number
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputText
                  id="localNumberInput"
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter local number"
                  {...register("localNumber", {
                    required: "Local number is required",
                  })}
                />
                {errors.localNumber && (
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
              {errors.localNumber && (
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
                  {errors.localNumber.message}
                </div>
              )}
            </div>
          </div>

          {/* Account Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
              <h4 className="text-sm font-semibold text-slate-700">
                Account Information
              </h4>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="usernameInput"
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
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Username
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputText
                  id="usernameInput"
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                {errors.username && (
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
              {errors.username && (
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
                  {errors.username.message}
                </div>
              )}
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
              className="flex items-center justify-center w-full h-12 gap-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create User Account
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default AddUserDialog;
