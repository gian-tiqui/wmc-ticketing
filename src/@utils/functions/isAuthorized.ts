import { UserData } from "../../types/types";

const isAuthorized = (user: UserData | undefined, requiredRoles: string[]) => {
  const authorized = requiredRoles.some((requiredRole) =>
    user?.roles.some((role) => role.name === requiredRole)
  );

  return authorized;
};

export default isAuthorized;
