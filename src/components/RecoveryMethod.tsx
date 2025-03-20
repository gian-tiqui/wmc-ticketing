import { useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { DropdownProps, Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { getSecretQuestions } from "../@utils/services/secetQuestionService";
import useHasSecretStore from "../@utils/store/userHasSecret";
import { useForm } from "react-hook-form";
import handleErrors from "../@utils/functions/handleErrors";
import {
  getUserSecret,
  updateUserSecretById,
} from "../@utils/services/userService";
import useUserDataStore from "../@utils/store/userDataStore";
import { Question, Secrets } from "../types/types";
import { confirmDialog } from "primereact/confirmdialog";
import ClipboardDialog from "./ClipboardDialog";
import CustomToast from "./CustomToast";

interface FormFields {
  questionId: number;
  answer: string;
  question: string;
}

const RecoveryMethod = () => {
  const toastRef = useRef<Toast>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { hasSecret, setHasSecret } = useHasSecretStore();
  const [selectedQuestion, setSelectedQuestion] = useState<
    Question | undefined
  >(undefined);
  const [secrets, setSecrets] = useState<Secrets | undefined>(undefined);
  const [clipboardDialogVisible, setClipboardDialogVisible] =
    useState<boolean>(false);
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
  } = useForm<FormFields>();
  const { user } = useUserDataStore();

  useEffect(() => {
    const setClipboardVisibility = () => {
      if (secrets) setClipboardDialogVisible(true);
    };

    setClipboardVisibility();
  }, [secrets]);

  useEffect(() => {
    const setValues = () => {
      if (user) {
        getUserSecret(user.sub)
          .then((response) => {
            if (response.data.secret === "none") return;

            const { question, answer } = response.data.secret;

            setValue("answer", answer);
            setValue("question", question);
          })
          .catch((error) => handleErrors(error, toastRef));
      }
    };

    setValues();
  }, [hasSecret, user, setValue]);

  useEffect(() => {
    const setQuestionId = () => {
      if (selectedQuestion) {
        setValue("questionId", selectedQuestion.id);
      }
    };

    setQuestionId();
  }, [selectedQuestion, setValue]);

  const { data: questions } = useQuery({
    queryKey: ["questions-dropdown"],
    queryFn: () => getSecretQuestions(),
  });

  const accept = async () => {
    const { questionId, answer } = getValues();
    if (user) {
      updateUserSecretById(user.sub, questionId, answer)
        .then((response) => {
          if (response.status === 200) {
            const { question } = response.data.secrets;

            setSecrets({
              question,
              answer: response.data.secrets.answer,
            });
            setIsEditMode(false);
            setHasSecret(true);
          }
        })
        .catch((error) => handleErrors(error, toastRef));
    }
  };

  const onSubmit = () => {
    confirmDialog({
      message: "Do you want to update your secret?",
      header: "Change Secret",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  const selectedQuestionTemplete = (
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-5 h-80">
      <CustomToast ref={toastRef} />
      <ClipboardDialog
        secrets={secrets}
        visible={clipboardDialogVisible}
        onHide={setClipboardDialogVisible}
      />
      <ScrollPanel style={{ height: "calc(72vh - 200px)" }} className="mb-5">
        <div className="flex justify-between w-full">
          <p className="w-full">Question</p>
          {isEditMode ? (
            <Dropdown
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
              disabled={!isEditMode}
              className="h-12 min-w-80 bg-inherit border-slate-400"
              value={selectedQuestion}
              onChange={(e) => {
                setSelectedQuestion(e.value);
              }}
              options={questions}
              optionLabel="question"
              placeholder="Select a question"
              filter
              valueTemplate={selectedQuestionTemplete}
              itemTemplate={questionOptionTemplate}
            />
          ) : (
            <IconField iconPosition="left" className="w-full">
              <InputIcon className={PrimeIcons.BUILDING}> </InputIcon>
              <InputText
                disabled={!isEditMode}
                placeholder={"Please select a secret"}
                className="w-full h-12 bg-inherit text-slate-100"
                {...register("question")}
              />
            </IconField>
          )}
          <div className="w-full"></div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full">Answer</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.LOCK}> </InputIcon>
            <InputText
              disabled={!isEditMode}
              {...register("answer", { required: true })}
              placeholder="Your answer"
              className="w-full h-10 bg-inherit text-slate-100"
            />
          </IconField>
          <div className="flex items-center justify-end w-full">
            {errors.answer && (
              <div className="flex items-center gap-2 text-red-500">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE}`}></i>
                <small className="text-red-400">Answer is required.</small>
              </div>
            )}
          </div>
        </div>
        <Divider />
      </ScrollPanel>
      <div className="flex justify-end gap-2">
        {isEditMode && (
          <Button
            className="w-52"
            severity="danger"
            type="button"
            onClick={() => setIsEditMode(false)}
            icon={`${PrimeIcons.SIGN_OUT} mr-2 text-xl`}
          >
            Cancel
          </Button>
        )}
        {isEditMode && (
          <Button
            className="w-52"
            type="submit"
            icon={`${PrimeIcons.SAVE} mr-2 text-xl`}
          >
            Save
          </Button>
        )}
        {!isEditMode && (
          <Button
            className="w-52"
            type="button"
            onClick={() => setIsEditMode(true)}
            icon={`${PrimeIcons.USER_EDIT} mr-2 text-xl`}
          >
            Edit
          </Button>
        )}
      </div>
    </form>
  );
};

export default RecoveryMethod;
