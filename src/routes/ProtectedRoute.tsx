import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUserDataStore from "../@utils/store/userDataStore";
import { UserData } from "../types/types";

interface Props {
  allowedRoles: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const { user } = useUserDataStore();

  const authorized = (user: UserData) => {
    return user.roles.some((role) => allowedRoles.includes(role.name));
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!authorized(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
