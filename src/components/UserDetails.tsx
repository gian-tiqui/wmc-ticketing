import React from "react";
import { User } from "../types/types";
import { Avatar } from "primereact/avatar";
import { Skeleton } from "primereact/skeleton";

interface Props {
  user: User | undefined;
  mode: "skeleton" | "normal";
}

const UserDetails: React.FC<Props> = ({ user, mode }) => {
  if (mode === "skeleton") {
    return (
      <div className="flex gap-2">
        <Skeleton className="!h-12 !w-12 bg-slate-600" />
        <div>
          <>
            <Skeleton className="!w-28 mb-2 bg-slate-600 !h-4" />
            <Skeleton className="!w-20 !h-3 bg-slate-600" />
          </>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Avatar
        label={user ? user.firstName[0] + user.lastName[0].toLowerCase() : "??"}
        className="w-12 h-12 font-extrabold bg-blue-500"
      />
      <div>
        {user ? (
          <>
            <p className="text-sm">
              {user.firstName} {user.lastName}
            </p>
            <h4 className="text-xs">{user.department.name}</h4>
          </>
        ) : (
          <>
            <p className="text-sm">No User Assigned</p>
            <h4 className="text-xs">No Department</h4>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
