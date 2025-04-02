import { NavigateFunction } from "react-router-dom";
import { UserData } from "../../types/types";
import roleIncludes from "./rolesIncludes";

const navigateBasedOnRole = (
  userData: UserData,
  navigate: NavigateFunction
) => {
  if (roleIncludes(userData, "admin")) {
    navigate("/dashboard");
  } else {
    navigate("/ticket");
  }
};

export default navigateBasedOnRole;
