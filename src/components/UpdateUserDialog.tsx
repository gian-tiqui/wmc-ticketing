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
        header={`${data?.data.user.firstName}'s Data`}
        visible={visible}
        className="w-96 h-[90vh]"
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
          onSubmit={handleSubmit(updateUser)}
          className={`overflow-auto h-[75vh] ${scrollbarTheme}`}
        >
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
              <span className="text-xs font-medium text-red-600">
                {errors.firstName.message}
              </span>
            )}
          </div>

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
              <span className="text-xs font-medium text-red-600">
                {errors.lastName.message}
              </span>
            )}
          </div>

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
              placeholder="Select a department"
              className="w-full h-12 px-3 text-sm border-black"
            />
            {errors.deptId && (
              <span className="text-xs font-medium text-red-600">
                {errors.deptId.message}
              </span>
            )}
          </div>

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

          <Button className="justify-center w-full h-12 mt-2 text-sm bg-blue-600">
            Update User
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default UpdateUserDialog;
