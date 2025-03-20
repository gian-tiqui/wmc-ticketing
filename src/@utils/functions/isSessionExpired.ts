import Cookies from "js-cookie";
import { Namespace } from "../enums/enum";
import { jwtDecode } from "jwt-decode";

const isSessionExpired = () => {
  const refreshToken = Cookies.get(Namespace.BASE);
  if (refreshToken) {
    try {
      const { exp } = jwtDecode(refreshToken);

      if (!exp) return;

      if (exp * 1000 < Date.now()) {
        return true;
      }
    } catch (error) {
      console.error("Invalid refresh token:", error);
      return true;
    }
  }

  return false;
};

export default isSessionExpired;
