import axios from "axios";
import { URI } from "../enums/enum";

const isServerRunning = async () => {
  try {
    const response = await axios.get(`${URI.API_URI}/api/v1/server-status`);

    if (response) {
      return true;
    }
  } catch (error) {
    const { code } = error as { code: string };
    console.error(code);

    if (code === "ERR_NETWORK") {
      return false;
    } else {
      return true;
    }
  }
};

export default isServerRunning;
