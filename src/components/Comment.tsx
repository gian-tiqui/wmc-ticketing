import { Avatar } from "primereact/avatar";
import React from "react";
import { Comment as CommentType } from "../types/types";
import { Image } from "primereact/image";
import getImageFromServer from "../@utils/functions/getImageFromServer";
import { Directory } from "../@utils/enums/enum";

interface Props {
  comment: CommentType;
  onRightClick: (event: React.MouseEvent, id: number) => void;
}

const Comment: React.FC<Props> = ({ comment, onRightClick }) => {
  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    if (dateStr === todayStr) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";

    return date.toLocaleString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Manila",
    });
  };

  return (
    <div key={comment.id} className="flex w-full gap-2">
      <Avatar
        label={comment.user.firstName[0] + comment.user.lastName[0]}
        className="w-12 h-12 font-extrabold text-white bg-blue-600"
        shape="circle"
      />
      <div className="w-full">
        <p className="text-sm font-medium">
          {`${comment.user.firstName} ${comment.user.lastName}`}{" "}
          <span className="text-xs font-light text-gray-400">
            {formatDate(new Date(comment.createdAt.split(" at ")[0]))} at{" "}
            {comment.createdAt.split(" at ")[1]}
          </span>
        </p>
        {comment.comment && (
          <p
            className="w-full text-sm font-medium hover:bg-[#EEEEEE]"
            onContextMenu={(e) => onRightClick(e, comment.id)}
          >
            {comment.comment}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {comment.imageLocations.length > 0 &&
            comment.imageLocations.map((imageLocation) => (
              <Image
                className="w-auto h-auto"
                src={getImageFromServer(
                  Directory.UPLOADS,
                  Directory.COMMENT,
                  imageLocation.path
                )}
                alt={`comment-${comment.id}-image-${imageLocation.id}`}
                key={imageLocation.id}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;
