import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getUser } from "../@utils/services/userService";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import { Dropdown } from "primereact/dropdown";
import { Query } from "../types/types";
import { getDepartments } from "../@utils/services/departmentService";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  id: number | null;
  setId: Dispatch<SetStateAction<number | null>>;
}

interface FormFields {
  deptId: number;
  firstName: string;
  middleName: string;
  lastName: string;
}

const UpdateUserDialog: React.FC<Props> = ({
  visible,
  setVisible,
  id,
  setId,
}) => {
  const [query] = useState<Query>({ offset: 0, limit: 100 });
  const { data } = useQuery({
    queryKey: [`update-user-${id}`],
    queryFn: () => getUser(id),
    enabled: !!id && id !== null,
  });

  const { data: departmentsData } = useQuery({
    queryKey: [`departments-${query}-update-user`],
    queryFn: () => getDepartments(query),
    enabled: !!id && id !== null,
  });

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
  } = useForm<FormFields>({});

  useEffect(() => {
    if (departmentsData) console.log(departmentsData.data);
  }, [departmentsData]);

  const updateUser = (data: FormFields) => {
    console.log(data);
  };

  useEffect(() => {
    if (data?.data.user) {
      setValue("firstName", data.data.user.firstName);
      setValue("middleName", data.data.user.middleName);
      setValue("lastName", data.data.user.lastName);
      setValue("deptId", data.data.user.department.id);
    }
  }, [data, setValue]);

  return (
    <Dialog
      header={`${data?.data.user.firstName}'s Data`}
      visible={visible}
      className="w-96 h-96"
      onHide={() => {
        if (visible) {
          setId(null);
          reset();
          setVisible((prev) => !prev);
        }
      }}
      pt={{
        headerTitle: { className: "text-sm" },
        header: { className: "rounded-t-3xl bg-[#EEEEEE]" },
        root: { className: "shadow-none" },
        content: { className: "rounded-b-3xl bg-[#EEEEEE] overflow-hidden" },
      }}
    >
      <form
        onSubmit={handleSubmit(updateUser)}
        className={`overflow-auto h-72 ${scrollbarTheme}`}
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
          {errors.middleName && (
            <span className="text-xs font-medium text-red-600">
              {errors.middleName.message}
            </span>
          )}
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
            className="w-full h-12 px-3 text-sm border-black"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <span className="text-xs font-medium text-red-600">
              {errors.lastName.message}
            </span>
          )}
        </div>

        <Button className="justify-center w-full h-12 text-sm bg-blue-600">
          Update User
        </Button>
      </form>
    </Dialog>
  );
};

export default UpdateUserDialog;
