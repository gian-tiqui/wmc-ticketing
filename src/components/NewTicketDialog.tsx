import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Category, CreateTicket, Department, Query } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import {
  getDepartmentCategoriesByDeptId,
  getDepartments,
} from "../@utils/services/departmentService";
import { Dropdown } from "primereact/dropdown";
import { TreeSelect } from "primereact/treeselect";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { createTicket } from "../@utils/services/ticketService";
import handleErrors from "../@utils/functions/handleErrors";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import { Dialog } from "primereact/dialog";
import { scrollbarTheme } from "../@utils/tw-classes/tw-class";
import { TreeNode } from "primereact/treenode";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  header?: ReactNode;
  refetch: () => void;
}

const NewTicketDialog: React.FC<Props> = ({ visible, setVisible, refetch }) => {
  const toastRef = useRef<Toast>(null);

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useForm<CreateTicket>({
    defaultValues: {
      deptId: undefined,
      categoryId: undefined,
      title: "",
      description: "",
      reportRequired: 0,
    },
  });

  const [query] = useState<Query>({ search: "", offset: 0, limit: 50 });
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [timeToFinish, setTimeToFinish] = useState<string>("");

  const { data: departmentsData } = useQuery<Department[]>({
    queryKey: [`departments-${JSON.stringify(query)}`],
    queryFn: () => getDepartments(query),
    enabled: !!visible,
  });

  const { data: departmentCategoriesData } = useQuery<{
    data: { categories: Category[] };
  }>({
    queryKey: [
      `department-${selectedDepartment?.id}-categories-${JSON.stringify(
        query
      )}`,
    ],
    queryFn: () =>
      getDepartmentCategoriesByDeptId(selectedDepartment?.id, query),
    enabled: !!selectedDepartment,
  });

  const buildCategoryTree = (categories: Category[]): TreeNode[] => {
    return categories.map((category) => ({
      key: category.id.toString(),
      label: category.name,
      icon: PrimeIcons.TAG,
      value: category.id.toString(),
      children: category.subCategories
        ? buildCategoryTree(category.subCategories)
        : undefined,
    }));
  };

  useEffect(() => {
    if (!visible) {
      reset();
      setSelectedCategory(undefined);
      setSelectedDepartment(undefined);
    }
  }, [visible, reset]);

  useEffect(() => {
    if (selectedCategory) {
      setTimeToFinish(`${selectedCategory.SLA} hours`);
    } else {
      setTimeToFinish("");
    }
  }, [selectedCategory]);

  const handleCreateTicket = (data: CreateTicket) => {
    createTicket(data)
      .then((response) => {
        if (response.status === 201) {
          toastRef.current?.show({
            severity: "success",
            detail: "Ticket Created Successfully.",
            summary: "Success",
          });
        }
        refetch();
        reset();
        setVisible(false);
        setSelectedCategory(undefined);
        setSelectedDepartment(undefined);
        setIsChecked(false);
      })
      .catch((error) => {
        handleErrors(error, toastRef);
      });
  };

  useEffect(() => {
    setValue("reportRequired", isChecked ? 1 : 0);
  }, [isChecked, setValue]);

  useEffect(() => {
    if (!visible) return;

    register("deptId", { required: "Department is required" });
    register("categoryId", { required: "Category is required" });
  }, [register, visible]);

  useEffect(() => {
    if (selectedDepartment) {
      setSelectedCategory(undefined);
      setValue("categoryId", undefined);
    }
  }, [selectedDepartment, setValue]);

  return (
    <>
      <CustomToast ref={toastRef} />

      <Dialog
        header={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl">
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
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Create Support Ticket
              </h3>
              <p className="text-sm text-slate-500">
                Submit a new request for technical assistance
              </p>
            </div>
          </div>
        }
        visible={visible}
        className="w-[90vw] max-w-3xl max-h-[90vh] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]"
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
          onSubmit={handleSubmit(handleCreateTicket)}
          noValidate
          className={`space-y-6 overflow-auto max-h-[65vh] pr-2 ${scrollbarTheme}`}
        >
          {/* Ticket Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-600"></div>
              <h4 className="text-sm font-semibold text-slate-700">
                Ticket Information
              </h4>
            </div>

            {/* Department Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="departmentsDropdown"
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
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Dropdown
                  id="departmentsDropdown"
                  options={departmentsData}
                  value={selectedDepartment}
                  optionLabel="name"
                  onChange={(e) => {
                    setSelectedDepartment(e.value);
                    setValue("deptId", e.value?.id, { shouldValidate: true });
                  }}
                  filter
                  placeholder="Select a department"
                  className="w-full text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                  pt={{
                    header: { className: "bg-white/90 backdrop-blur-sm" },
                    filterInput: {
                      className: "bg-white/50 border-slate-200 rounded-lg",
                    },
                    list: {
                      className:
                        "bg-white/90 backdrop-blur-sm border-slate-200",
                    },
                    item: {
                      className:
                        "hover:bg-violet-50 transition-colors duration-150",
                    },
                    input: { className: "text-sm" },
                  }}
                />
                {errors.deptId && (
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

            {/* Category TreeSelect */}
            <div className="space-y-2">
              <label
                htmlFor="categoriesTreeSelect"
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Category
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <TreeSelect
                  id="categoriesTreeSelect"
                  filter
                  className="w-full text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                  options={buildCategoryTree(
                    departmentCategoriesData?.data.categories || []
                  )}
                  onChange={(e) => {
                    if (!e.value) {
                      setSelectedCategory(undefined);
                      setValue("categoryId", undefined, {
                        shouldValidate: true,
                      });
                      return;
                    }

                    const findCategoryById: (
                      categories: Category[],
                      id: string
                    ) => Category | undefined = (categories, id) => {
                      for (const category of categories) {
                        if (category.id.toString() === id) {
                          return category;
                        }
                        if (category.subCategories) {
                          const found = findCategoryById(
                            category.subCategories,
                            id
                          );
                          if (found) return found;
                        }
                      }
                      return undefined;
                    };

                    const selectedCat = findCategoryById(
                      departmentCategoriesData?.data.categories || [],
                      e.value.toString()
                    );

                    if (selectedCat) {
                      setSelectedCategory(selectedCat);
                      setValue("categoryId", selectedCat.id, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  value={selectedCategory?.id.toString()}
                  placeholder="Select a category"
                  disabled={
                    selectedDepartment &&
                    departmentCategoriesData?.data.categories.length === 0
                  }
                  pt={{
                    root: {
                      className:
                        "bg-white/70 backdrop-blur-sm border-slate-200",
                    },
                    wrapper: { className: "bg-white/90 backdrop-blur-sm" },
                    header: {
                      className:
                        "bg-white/90 backdrop-blur-sm border-b border-slate-200",
                    },
                    filter: {
                      className: "bg-white/50 border-slate-200 rounded-lg",
                    },
                    panel: {
                      className: "text-sm shadow-xl border-slate-200",
                    },
                    tree: {
                      root: {
                        className: "bg-white/90 backdrop-blur-sm text-sm",
                      },
                      content: {
                        className: "bg-white/90 backdrop-blur-sm text-sm",
                      },
                      node: {
                        className:
                          "text-sm hover:bg-violet-50 transition-colors duration-150",
                      },
                      nodeIcon: {
                        className: "w-4 h-4 mr-1",
                      },
                    },
                  }}
                />
                {errors.categoryId && (
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
              {errors.categoryId && (
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
                  {errors.categoryId.message}
                </div>
              )}
            </div>

            {/* Time to Finish Display */}
            <div className="space-y-2">
              <label
                htmlFor="timeToFinishInput"
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Estimated Time to Complete
              </label>
              <div className="relative">
                <InputText
                  id="timeToFinishInput"
                  value={timeToFinish}
                  placeholder="Time will be calculated automatically"
                  readOnly
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm cursor-not-allowed h-11 bg-slate-50/70 backdrop-blur-sm border-slate-200 rounded-xl text-slate-600"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Request Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
              <h4 className="text-sm font-semibold text-slate-700">
                Request Details
              </h4>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label
                htmlFor="titleInput"
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Title
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <InputText
                  id="titleInput"
                  {...register("title", { required: "Title is required." })}
                  placeholder="Brief description of your request (e.g., Change Printer Drum)"
                  className="w-full px-4 text-sm transition-all duration-200 shadow-sm h-11 bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
                {errors.title && (
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
              {errors.title && (
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
                  {errors.title.message}
                </div>
              )}
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label
                htmlFor="descriptionInput"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Description
                <span className="text-xs text-slate-400">(Optional)</span>
              </label>
              <InputTextarea
                id="descriptionInput"
                {...register("description", { required: false })}
                placeholder="Provide detailed information about your request, including any specific requirements or context..."
                className="w-full px-4 py-3 text-sm transition-all duration-200 shadow-sm resize-none bg-white/70 backdrop-blur-sm border-slate-200 rounded-xl hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                rows={6}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200/50">
            <Button
              type="submit"
              className="flex items-center justify-center w-full h-12 gap-2 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30"
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Submit Support Request
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default NewTicketDialog;
