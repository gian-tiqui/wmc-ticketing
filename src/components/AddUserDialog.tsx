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
  roleNames: string[]; // only role names will be submitted
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
        header="Create New User"
        visible={visible}
        className="w-96 h-[90vh]"
        onHide={() => setVisible(false)}
        pt={{
          headerTitle: { className: "text-sm" },
          header: { className: "rounded-t-3xl bg-[#EEEEEE]" },
          root: { className: "shadow-none" },
          content: { className: "rounded-b-3xl bg-[#EEEEEE] overflow-hidden" },
          mask: { className: "backdrop-blur" },
        }}
      >
        <form
          onSubmit={handleSubmit(handleCreateUser)}
          className={`overflow-auto h-[75vh] ${scrollbarTheme}`}
        >
          {/* First Name */}
          <div className="h-24">
            <label htmlFor="firstNameInput" className="text-xs font-medium">
              First Name
            </label>
            <InputText
              id="firstNameInput"
              className="w-full h-12 px-3 text-sm border-black"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <span className="text-xs text-red-600">
                {errors.firstName.message}
              </span>
            )}
          </div>

          {/* Middle Name */}
          <div className="h-24">
            <label htmlFor="middleNameInput" className="text-xs font-medium">
              Middle Name
            </label>
            <InputText
              id="middleNameInput"
              className="w-full h-12 px-3 text-sm border-black"
              {...register("middleName")}
            />
          </div>

          {/* Last Name */}
          <div className="h-24">
            <label htmlFor="lastNameInput" className="text-xs font-medium">
              Last Name
            </label>
            <InputText
              id="lastNameInput"
              className="w-full h-12 px-3 text-sm border-black"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <span className="text-xs text-red-600">
                {errors.lastName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="h-24">
            <label htmlFor="emailInput" className="text-xs font-medium">
              Email
            </label>
            <InputText
              id="emailInput"
              className="w-full h-12 px-3 text-sm border-black"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <span className="text-xs text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="h-24">
            <label htmlFor="usernameInput" className="text-xs font-medium">
              Username
            </label>
            <InputText
              id="usernameInput"
              className="w-full h-12 px-3 text-sm border-black"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <span className="text-xs text-red-600">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Local Number */}
          <div className="h-24">
            <label htmlFor="localNumberInput" className="text-xs font-medium">
              Local Number
            </label>
            <InputText
              id="localNumberInput"
              className="w-full h-12 px-3 text-sm border-black"
              {...register("localNumber", {
                required: "Local number is required",
              })}
            />
            {errors.localNumber && (
              <span className="text-xs text-red-600">
                {errors.localNumber.message}
              </span>
            )}
          </div>

          {/* Department */}
          <div className="h-24">
            <label htmlFor="departmentDropdown" className="text-xs font-medium">
              Department
            </label>
            <Dropdown
              id="departmentDropdown"
              options={departmentsData}
              onChange={(e) => setSelectedDepartment(e.value)}
              value={selectedDepartment}
              optionLabel="name"
              placeholder="Select Department"
              className="w-full h-12 px-3 text-sm border-black"
            />
            {errors.deptId && (
              <span className="text-xs text-red-600">
                {errors.deptId.message}
              </span>
            )}
          </div>

          {/* Roles */}
          <div className="h-32">
            <label htmlFor="rolesDropdown" className="text-xs font-medium">
              Roles
            </label>
            <MultiSelect
              id="rolesDropdown"
              options={rolesData?.data.roles ?? []}
              value={selectedRoles}
              onChange={(e) => setSelectedRoles(e.value)}
              optionLabel="name"
              placeholder="Select roles"
              className="w-full text-sm border-black"
              display="chip"
            />
          </div>

          {/* Submit Button */}
          <Button className="justify-center w-full h-12 mt-2 text-sm bg-blue-600">
            Create User
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default AddUserDialog;
