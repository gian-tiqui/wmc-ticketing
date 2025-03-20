import { jwtDecode } from "jwt-decode";
import { Namespace } from "../enums/enum";
import { UserData } from "../../types/types";

const extractUserData = (): UserData | undefined => {
  const accessToken = localStorage.getItem(Namespace.BASE);

  if (!accessToken) {
    return;
  }

  const userData: UserData = jwtDecode(accessToken);

  return userData;
};

export default extractUserData;
