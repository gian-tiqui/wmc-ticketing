import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useRef } from "react";
import { CreateComment, Ticket } from "../types/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { createComment } from "../@utils/services/commentService";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";

interface Props {
  ticketId: number;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const CommentBar: React.FC<Props> = ({ ticketId, refetch }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateComment>({
    defaultValues: {
      ticketId: ticketId,
      comment: "",
    },
  });
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    if (errors.comment) {
      toastRef.current?.show({
        summary: "Comment must not be empty",
        severity: "error",
      });
    }
  }, [errors.comment]);

  const handleCommentSend: SubmitHandler<CreateComment> = async (data) => {
    try {
      await createComment(data);
      await refetch();
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
      <CustomToast ref={toastRef} />
      <div className="w-full">
        <InputTextarea
          {...register("comment", {
            required: "Comment cannot be empty",
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
      <div className="flex justify-center w-40 gap-2">
        <Button
          icon={PrimeIcons.UPLOAD}
          className="w-10 h-10 rounded-full"
          type="button"
        />
        <Button
          icon={PrimeIcons.SEND}
          className="w-10 h-10 rounded-full"
          type="submit"
          onClick={handleSubmit(handleCommentSend)}
        />
      </div>
    </div>
  );
};

export default CommentBar;
