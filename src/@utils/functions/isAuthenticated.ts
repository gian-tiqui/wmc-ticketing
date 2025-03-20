import Cookies from "js-cookie";
import { Namespace } from "../enums/enum";

const isAuthenticated = () => {
  return (
    localStorage.getItem(Namespace.BASE) !== undefined &&
    Cookies.get(Namespace.BASE) !== undefined
  );
};

export default isAuthenticated;
