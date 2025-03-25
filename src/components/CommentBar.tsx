import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect } from "react";
import { CreateComment, Ticket } from "../types/types";
import { useForm } from "react-hook-form";
import { createComment } from "../@utils/services/commentService";

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
  } = useForm<CreateComment>();

  useEffect(() => {
    setValue("ticketId", ticketId);
  }, [ticketId, setValue]);

  const handleCommentSend = async (data: CreateComment) => {
    try {
      await createComment(data);
      await refetch();
      reset();
      setValue("ticketId", ticketId);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleCommentSend)}
      className="flex h-20 gap-2 p-4 bg-slate-700 rounded-xl"
    >
      <div className="w-full">
        <InputTextarea
          {...register("comment", { required: "Comment cannot be empty" })}
          name="comment"
          className="w-full border-none bg-inherit text-slate-100"
          placeholder="Write a comment..."
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-500">{errors.comment.message}</p>
        )}
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
        />
      </div>
    </form>
  );
};

export default CommentBar;
