import React from "react";
import { User } from "../types/types";
import { Avatar } from "primereact/avatar";

interface Props {
  user: User;
}

const UserDetails: React.FC<Props> = ({ user }) => {
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
