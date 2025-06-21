import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const getRoles = async () => {
  return apiClient.get(`${URI.API_URI}/api/v1/roles`);
};

export { getRoles };
