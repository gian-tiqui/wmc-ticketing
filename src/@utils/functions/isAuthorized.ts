import { UserData } from "../../types/types";

const isAuthorized = (user: UserData, allowedRoles: string[]) => {
  return user.roles.some((role) => allowedRoles.includes(role.name));
};

export default isAuthorized;
