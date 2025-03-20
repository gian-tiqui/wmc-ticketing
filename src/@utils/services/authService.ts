import Cookies from "js-cookie";
import { Namespace, URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";
import { ForgotPassword } from "../../types/types";
import axios from "axios";

const login = async (username: string, password: string) => {
  return axios.post(`${URI.API_URI}/api/v1/auth/login`, {
    username,
    password,
  });
};

const refresh = async () => {
  const refreshToken = Cookies.get(Namespace.BASE);
  return apiClient.post(`${URI.API_URI}/api/v1/auth/refresh`, {
    refreshToken,
  });
};

const forgotPassword = async ({
  answer,
  employeeId,
  questionId,
}: ForgotPassword) => {
  return axios.post(`${URI.API_URI}/api/v1/auth/forgot-password`, {
    answer,
    employeeId,
    questionId,
  });
};

const changePassword = async (userId: number, newPassword: string) => {
  return apiClient.post(`${URI.API_URI}/api/v1/auth/change-password`, {
    userId,
    newPassword,
  });
};

export { login, refresh, forgotPassword, changePassword };
