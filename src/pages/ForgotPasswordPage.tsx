import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Link } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { ForgotPassword, Question } from "../types/types";
import { useForm } from "react-hook-form";
import { getSecretQuestions } from "../@utils/services/secetQuestionService";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { forgotPassword } from "../@utils/services/authService";
import handleErrors from "../@utils/functions/handleErrors";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import CustomToast from "../components/CustomToast";

const ForgotPasswordPage = () => {
  const toastRef = useRef<Toast>(null);
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPassword>();
  const [selectedQuestion, setSelectedQuestion] = useState<
    Question | undefined
  >(undefined);
  const [changePasswordDialogVisible, setChangePasswordDialogVisible] =
    useState<boolean>(false);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  const { data: questions } = useQuery({
    queryKey: ["questions-dropdown"],
    queryFn: () => getSecretQuestions(),
  });

  useEffect(() => {
    const setQuestionId = () => {
      if (selectedQuestion) {
        setValue("questionId", selectedQuestion.id);
      }
    };

    setQuestionId();
  }, [selectedQuestion, setValue]);

  const accept = async () => {
    const { answer, employeeId, questionId } = getValues();

    forgotPassword({ answer, employeeId, questionId })
      .then((response) => {
        if (response.status === 201) {
          setUserId(response.data.id);
          setChangePasswordDialogVisible(true);
        }
      })
      .catch((error) => {
        handleErrors(error, toastRef);
      });
  };

  const onSubmit = () => {
    confirmDialog({
      message: "Have you entered the correct details?",
      header: "Change Password",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  const selectedOptionTemplete = (
    option: { question: string },
    props: DropdownProps
  ) => {
    if (option) {
      return (
        <div className="flex w-full gap-2">
          <div>{option.question}</div>
        </div>
      );
    }

    return <span className="bg-slate-800">{props.placeholder}</span>;
  };

  const questionOptionTemplate = (option: { question: string }) => {
    return (
      <div className="flex w-full gap-2">
        <div>{option.question}</div>
      </div>
    );
  };

  return (
    <PageTemplate>
      <ChangePasswordDialog
        userId={userId}
        visible={changePasswordDialogVisible}
        onHide={setChangePasswordDialogVisible}
      />
      <ConfirmDialog
        pt={{
          header: {
            className:
              "bg-slate-900 text-slate-100 border-x border-t border-slate-700",
          },
          content: {
            className: "bg-slate-900 text-slate-100 border-x border-slate-700",
          },
          footer: {
            className: "bg-slate-900 border-x border-b border-slate-700",
          },
        }}
      />
      <CustomToast ref={toastRef} />
      <main className="grid h-full place-content-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-3 px-4 pt-4 pb-4 border rounded shadow-md border-slate-600 bg-slate-900/40 w-96 shadow-blue-500/30"
        >
          <div className="grid border-2 shadow-xl w-14 h-14 border-slate-600 place-content-center rounded-2xl">
            <i
              className={`${PrimeIcons.QUESTION_CIRCLE} text-2xl text-slate-100`}
            />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Forgot Password</h3>

          <h4 className="text-center text-slate-400">
            Recover your password here
          </h4>
          <div className="flex flex-col w-full gap-1">
            <div className="h-24">
              <label
                htmlFor="employeeIdInput"
                className="text-sm font-semibold text-blue-400"
              >
                Employee ID
              </label>
              <IconField id="employeeIdInput" iconPosition="left">
                <InputIcon className={`${PrimeIcons.ID_CARD}`}></InputIcon>
                <InputText
                  {...register("employeeId", { required: true })}
                  id="employeeIdInput"
                  placeholder="0000XXXX"
                  className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
                />
              </IconField>
              {errors.employeeId && (
                <small className="flex items-center gap-1 mt-1">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                  ></i>
                  <p className="font-medium text-red-400">
                    Employee id is required.
                  </p>
                </small>
              )}
            </div>

            <div className="w-full h-24">
              <label
                htmlFor="questionsDropdown"
                className="text-sm text-blue-400"
              >
                Your question
              </label>
              <Dropdown
                id="questionsDropdown"
                pt={{
                  header: { className: "bg-slate-800" },
                  filterInput: { className: "bg-inherit text-slate-100" },
                  list: { className: "bg-slate-800" },
                  item: {
                    className:
                      "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
                  },
                  input: { className: "text-slate-100" },
                }}
                className="w-full bg-inherit border-slate-400"
                value={selectedQuestion}
                onChange={(e) => {
                  setSelectedQuestion(e.value);
                }}
                options={questions}
                optionLabel="question"
                placeholder="Select a question"
                filter
                valueTemplate={selectedOptionTemplete}
                itemTemplate={questionOptionTemplate}
              />
              {errors.questionId && (
                <small className="flex items-center gap-1 mt-1">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                  ></i>
                  <p className="font-medium text-red-400">
                    Question is required
                  </p>
                </small>
              )}
            </div>

            <div className="h-24">
              <label
                htmlFor="secretAnswerInput"
                className="text-sm font-semibold text-blue-400"
              >
                Your answer
              </label>
              <IconField id="secretAnswerInput" iconPosition="left">
                <InputIcon
                  id="secretAnswerInput"
                  className="pi pi-lock"
                ></InputIcon>
                <InputText
                  {...register("answer", { required: true })}
                  placeholder="Your answer"
                  className="w-full text-slate-100 bg-inherit border-slate-600 hover:border-blue-400"
                />
              </IconField>
              {errors.answer && (
                <small className="flex items-center gap-1 mt-1">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                  ></i>
                  <p className="font-medium text-red-400">Answer is required</p>
                </small>
              )}
            </div>
          </div>
          <div className="flex justify-end w-full">
            <Link
              to={"/login"}
              className="text-sm text-blue-400 text-end hover:text-blue-600 hover:underline"
            >
              Go back?
            </Link>
          </div>
          <Button
            className="flex justify-center w-full gap-3 font-bold"
            type="submit"
          >
            Reset Password
          </Button>
        </form>
      </main>
    </PageTemplate>
  );
};

export default ForgotPasswordPage;
