import React, { useRef, useState, useEffect } from "react";
import { CustomFile, Ticket } from "../types/types";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import CommentBar from "./CommentBar";
import { ContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import Comment from "./Comment";
import { deleteCommentById } from "../@utils/services/commentService";
import { confirmDialog } from "primereact/confirmdialog";
import UpdateCommentDialog from "./UpdateCommentDialog";

interface Props {
  ticket: Ticket;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Ticket, Error>>;
}

const TicketComments: React.FC<Props> = ({ ticket, refetch }) => {
  const contextMenu = useRef<ContextMenu>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [files, setFiles] = useState<CustomFile[]>([]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    }
  }, [ticket.comments]);

  const onRightClick = (event: React.MouseEvent, id: number) => {
    event.preventDefault();
    setSelectedId(id);
    if (contextMenu.current) {
      contextMenu.current.show(event);
    }
  };

  const deleteComment = (commentId: number | null) => {
    confirmDialog({
      header: "Delete this comment?",
      defaultFocus: "reject",
      accept: () => {
        deleteCommentById(commentId).then((response) => {
          if (response?.status === 200) {
            refetch();
          }
        });
      },
    });
  };

  const menuItems: MenuItem[] = [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => setVisible(true),
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => deleteComment(selectedId),
    },
  ];

  return (
    <div>
      <UpdateCommentDialog
        commentId={selectedId}
        visible={visible}
        setVisible={setVisible}
      />
      <div
        ref={scrollContainerRef}
        className="w-full p-4 overflow-y-auto h-[65vh] md:h-80 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
      >
        <div>
          <Avatar
            label={ticket.id.toString()}
            className="w-12 h-12 mb-6 text-xl font-extrabold bg-blue-500"
          />
          <h4 className="mb-2 text-2xl font-extrabold">
            {ticket.title} - {ticket.category.name}
          </h4>
          <h6>{ticket.description}</h6>
          <div className="flex items-center gap-2">
            <Divider />
            <p className="mx-2 text-sm text-center w-80">Chat starts here</p>
            <Divider />
          </div>
        </div>

        <div className="flex flex-col w-full gap-6">
          {ticket.comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onRightClick={onRightClick}
            />
          ))}
        </div>
      </div>

      <CommentBar
        ticketId={ticket.id}
        refetch={refetch}
        setFiles={setFiles}
        files={files}
      />

      <ContextMenu
        model={menuItems}
        ref={contextMenu}
        className="bg-slate-900"
        pt={{
          menuitem: { className: "hover:bg-slate-800" },
          label: { className: "text-slate-100" },
          icon: { className: "text-slate-100" },
        }}
      />
    </div>
  );
};

export default TicketComments;
