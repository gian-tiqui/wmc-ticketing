import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUserDataStore from "../@utils/store/userDataStore";
import isAuthorized from "../@utils/functions/isAuthorized";

interface Props {
  allowedRoles: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const { user } = useUserDataStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized(user, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
