import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Divider } from "primereact/divider";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../@utils/services/departmentService";
import useUserDataStore from "../@utils/store/userDataStore";
import { updateUserById } from "../@utils/services/userService";
import { Department } from "../types/types";
import { refresh } from "../@utils/services/authService";
import { Namespace } from "../@utils/enums/enum";
import extractUserData from "../@utils/functions/extractUserData";
import handleErrors from "../@utils/functions/handleErrors";
import CustomToast from "./CustomToast";
import { UserFormData } from "./AddUserDialog";

const SettingsDetail = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const { user, setUser } = useUserDataStore();
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<UserFormData>();
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    const setUserDetails = () => {
      if (user?.firstName) setValue("firstName", user.firstName);
      if (user?.middleName) setValue("middleName", user.middleName);
      if (user?.lastName) setValue("lastName", user.lastName);
      if (user?.deptId) setValue("deptId", user.deptId);
    };

    setUserDetails();
  }, [user, setValue]);

  useEffect(() => {
    const changeFormDeptId = () => {
      if (selectedDepartment) {
        setValue("deptId", selectedDepartment.id);
      }
    };

    changeFormDeptId();
  }, [selectedDepartment, setValue]);

  const { data: departments } = useQuery({
    queryKey: [`departments-dropdown`],
    queryFn: () => getDepartments({ search: "" }),
  });

  const accept = () => {
    if (user?.sub) {
      updateUserById(user?.sub, { ...getValues() })
        .then((response) => {
          if (response.status === 200) {
            refresh()
              .then((response) => {
                if (response.status === 201) {
                  const { accessToken } = response.data;

                  localStorage.setItem(Namespace.BASE, accessToken);

                  const newUserData = extractUserData();

                  if (newUserData) {
                    setUser(newUserData);

                    toastRef.current?.show({
                      severity: "info",
                      summary: "Success",
                      detail: "Your profile has been updated successfully.",
                    });

                    setIsEditMode(false);
                  } else {
                    console.error(
                      "There was a problem in updating your profile"
                    );
                  }
                }
              })
              .catch((error) => handleErrors(error, toastRef));
          }
        })
        .catch((error) => handleErrors(error, toastRef));
    }
  };

  const onSubmit = () => {
    confirmDialog({
      message: "Do you want to save the changes?",
      header: "Update profile",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  const selectedDepartmentTemplate = (
    option: { code: string; name: string },
    props: DropdownProps
  ) => {
    if (option) {
      return (
        <div className="flex w-full gap-2">
          <div>{option.code}</div>
          <div>{option.name}</div>
        </div>
      );
    }

    return <span className="">{props.placeholder}</span>;
  };

  const departmentOptionTemplate = (option: { code: string; name: string }) => {
    return (
      <div className="flex w-full gap-2">
        <div>{option.code}</div>
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-4 h-80">
      <CustomToast ref={toastRef} />
      <ScrollPanel style={{ height: "calc(72vh - 200px)" }} className="mb-5">
        <div className="flex justify-between w-full">
          <p className="w-full text-xs">First name</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.USER}> </InputIcon>
            <InputText
              {...register("firstName", { required: true })}
              disabled={!isEditMode}
              placeholder="Jonathan"
              className="w-full h-12 text-xs bg-white border-black"
            />
          </IconField>
          <div className="items-center justify-end hidden w-full md:flex ">
            {errors.firstName && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small>First name is required.</small>
              </div>
            )}
          </div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full text-xs">Middle name</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.USER}> </InputIcon>
            <InputText
              {...register("middleName")}
              disabled={!isEditMode}
              placeholder="Jason"
              className="w-full h-12 text-xs bg-white border-black"
            />
          </IconField>
          <div className="items-center justify-end hidden w-full md:flex "></div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full text-xs">Last name</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.USER}> </InputIcon>
            <InputText
              {...register("lastName", { required: true })}
              disabled={!isEditMode}
              placeholder="Ric"
              className="w-full h-12 text-xs bg-white border-black"
            />
          </IconField>
          <div className="items-center justify-end hidden w-full md:flex">
            {errors.lastName && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">Last name is required.</small>
              </div>
            )}
          </div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full text-xs">Department</p>
          {isEditMode ? (
            <Dropdown
              pt={{
                header: { className: "" },
                filterInput: { className: "bg-inherit " },
                list: { className: "" },
                item: {
                  className: " focus:",
                },
                input: { className: "" },
              }}
              disabled={!isEditMode}
              className="w-full h-12 text-xs bg-white border-black"
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.value);
              }}
              options={departments}
              optionLabel="name"
              placeholder="Select a department"
              filter
              valueTemplate={selectedDepartmentTemplate}
              itemTemplate={departmentOptionTemplate}
            />
          ) : (
            <IconField iconPosition="left" className="w-full">
              <InputIcon className={PrimeIcons.BUILDING}> </InputIcon>
              <InputText
                value={user?.deptName}
                disabled={!isEditMode}
                placeholder="Ric"
                className="w-full h-12 text-xs bg-white border-black"
              />
            </IconField>
          )}

          <div className="items-center justify-end hidden w-full md:flex "></div>
        </div>
      </ScrollPanel>
      <div className="flex justify-end gap-2">
        {isEditMode && (
          <Button
            className="w-40 text-sm"
            severity="danger"
            type="button"
            onClick={() => setIsEditMode(false)}
            icon={`${PrimeIcons.SIGN_OUT} mr-2 text-sm`}
          >
            Cancel
          </Button>
        )}
        {isEditMode && (
          <Button
            className="w-40 text-sm bg-blue-600"
            icon={`${PrimeIcons.SAVE} mr-2 text-sm`}
            type="submit"
          >
            Save
          </Button>
        )}
        {!isEditMode && (
          <Button
            className="w-40 text-sm bg-blue-600"
            type="button"
            onClick={() => setIsEditMode(true)}
            icon={`${PrimeIcons.USER_EDIT} mr-2 text-sm`}
          >
            Edit
          </Button>
        )}
      </div>
    </form>
  );
};

export default SettingsDetail;
