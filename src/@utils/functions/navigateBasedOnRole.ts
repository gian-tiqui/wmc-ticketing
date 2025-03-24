import { NavigateFunction } from "react-router-dom";
import { UserData } from "../../types/types";
import isAuthorized from "./isAuthorized";

const navigateBasedOnRole = (
  userData: UserData,
  navigate: NavigateFunction
) => {
  if (isAuthorized(userData, ["user", "admin"])) {
    navigate("/dashboard");
  } else if (isAuthorized(userData, ["user"])) {
    navigate("/ticket");
  }
};

export default navigateBasedOnRole;
