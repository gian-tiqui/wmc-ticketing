import { UserData } from "../../types/types";

const roleIncludes = (user: UserData | undefined, role: string): boolean => {
  if (!user || !user.roles) {
    return false;
  }

  const authorized = user.roles.some((userRole) => userRole.name === role);

  return authorized;
};

export default roleIncludes;
