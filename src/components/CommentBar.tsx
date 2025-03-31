import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { CreateComment, CustomFile, Ticket } from "../types/types";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  createComment,
  uploadCommentPhotosByCommentId,
} from "../@utils/services/commentService";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import CommentPictureUpload from "./CommentPictureUpload";

interface Props {
  ticketId: number;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
  setFiles: Dispatch<SetStateAction<CustomFile[]>>;
  files: CustomFile[];
}

const CommentBar: React.FC<Props> = ({
  ticketId,
  refetch,
  setFiles,
  files,
}) => {
  const { register, handleSubmit, watch, reset, setValue } =
    useForm<CreateComment>({
      defaultValues: {
        ticketId: ticketId,
        comment: "",
      },
    });
  const toastRef = useRef<Toast>(null);
  const [uploadDialogVisible, setUploadDialogVisible] =
    useState<boolean>(false);

  const handleCommentSend: SubmitHandler<CreateComment> = async (data) => {
    try {
      const response = await createComment(data);

      const id = response.data.commentId;

      await refetch();

      if (id && files && files.length > 0) {
        const formData = new FormData();

        files.forEach((file) => formData.append("files", file.file));

        uploadCommentPhotosByCommentId(id, formData)
          .then((response) => {
            if (response.status === 201) {
              setFiles([]);
              refetch();
            }
          })
          .catch((error) => console.error(error));
      }

      reset();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toastRef.current?.show({
        summary: "Failed to submit comment",
        severity: "error",
      });
    }
  };

  return (
    <div
      className="flex h-20 gap-2 p-4 bg-slate-700 rounded-xl"
      onSubmit={handleSubmit(handleCommentSend)}
    >
      <CommentPictureUpload
        files={files}
        visible={uploadDialogVisible}
        setVisible={setUploadDialogVisible}
        setFiles={setFiles}
      />
      <CustomToast ref={toastRef} />
      <div className="w-full">
        <InputTextarea
          {...register("comment", {
            onChange: (e) => {
              setValue("comment", e.target.value, {
                shouldValidate: true,
              });
            },
          })}
          name="comment"
          className="w-full h-12 border-none bg-inherit text-slate-100"
          placeholder="Write a comment..."
        />
      </div>
      <div className="flex items-center justify-center w-40 gap-2">
        <div className="relative">
          <Button
            icon={PrimeIcons.UPLOAD}
            className="w-10 h-10 rounded-full"
            type="button"
            onClick={() => setUploadDialogVisible(true)}
          />
          <div
            className={`bg-white rounded-full cursor-pointer absolute -bottom-1 -right-1 w-5 h-5 text-blue-500 grid place-content-center font-bold text-[13px]`}
          >
            {files.length}
          </div>
        </div>

        <Button
          icon={PrimeIcons.SEND}
          className="w-10 h-10 rounded-full"
          type="submit"
          disabled={watch("comment") == ""}
          onClick={handleSubmit(handleCommentSend)}
        />
      </div>
    </div>
  );
};

export default CommentBar;
