import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUserDataStore from "../@utils/store/userDataStore";
import { UserData } from "../types/types";

interface Props {
  allowedRoles: { name: string }[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const { user } = useUserDataStore();

  const authorized = (user: UserData) => {
    return user.roles.some((role) =>
      allowedRoles.some((allowedRole) => allowedRole.name === role.name)
    );
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!authorized(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
