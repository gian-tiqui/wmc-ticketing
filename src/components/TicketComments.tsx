import React, { useRef, useState } from "react";
import { Ticket } from "../types/types";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";
import CommentBar from "./CommentBar";
import { ContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";

interface Props {
  ticket: Ticket;
}

const TicketComments: React.FC<Props> = ({ ticket }) => {
  const contextMenu = useRef<ContextMenu>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const onRightClick = (event: React.MouseEvent, id: number) => {
    event.preventDefault();
    setSelectedId(id);
    if (contextMenu.current) {
      contextMenu.current.show(event);
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => alert(`Edit comment ${selectedId}`),
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => alert(`Delete comment ${selectedId}`),
    },
  ];

  return (
    <div>
      <ScrollPanel style={{ width: "100%", height: "20rem" }} className="p-4">
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
            <p className="mx-2 text-sm text-center w-80">March 23, 2023</p>
            <Divider />
          </div>
        </div>

        <div>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                className="flex gap-2 p-2 mb-6 rounded-md cursor-pointer hover:bg-gray-700"
                key={index}
                onContextMenu={(e) => onRightClick(e, index)}
              >
                <Avatar label="Se" className="w-12 h-12 bg-blue-500" />
                <div>
                  <p className="font-medium text-slate-100">
                    Sender{" "}
                    <span className="text-xs font-light ms-1">
                      Today at 3:23 pm
                    </span>
                  </p>
                  <p>hi po</p>
                  <p>hi po</p>
                  <p>hi po</p>
                  <p>hi po</p>
                  <p>hi po</p>
                </div>
              </div>
            ))}
        </div>
      </ScrollPanel>

      <CommentBar />

      <ContextMenu
        model={menuItems}
        ref={contextMenu}
        className="bg-slate-900"
        pt={{
          menuitem: { className: "hover:bg-slate-800" },
          label: { className: "text-slate-100" },
          icon: { className: "text-slate-100" },
          content: { className: "hover:bg-slate-800" },
        }}
      />
    </div>
  );
};

export default TicketComments;
