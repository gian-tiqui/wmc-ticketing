import { ChangePassword, User } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const getUser = async (id: number) => {
  return apiClient.get(`${URI.API_URI}/api/v1/user/${id}`);
};

const getUserSecret = async (id: number) => {
  return apiClient.get(`${URI.API_URI}/api/v1/user/${id}/secret`);
};

const updateUserById = async (
  userId: number,
  { firstName, middleName, lastName, deptId }: User
) => {
  return apiClient.patch(`${URI.API_URI}/api/v1/user/${userId}`, {
    firstName,
    middleName,
    lastName,
    deptId,
  });
};

const changePassword = async (
  userId: number,
  { oldPassword, newPassword }: ChangePassword
) => {
  return apiClient.patch(
    `${URI.API_URI}/api/v1/user/${userId}/change-password`,
    { oldPassword, newPassword }
  );
};

const updateUserSecretById = async (
  userId: number,
  questionId: number,
  answer: string
) => {
  return apiClient.patch(
    `${URI.API_URI}/api/v1/user/${userId}/update-secret?questionId=${questionId}&answer=${answer}`
  );
};

const verifyPasswordById = async (userId: number, password: string) => {
  return apiClient.post(
    `${URI.API_URI}/api/v1/user/${userId}/verify?password=${password}`
  );
};

export {
  getUser,
  updateUserById,
  changePassword,
  getUserSecret,
  updateUserSecretById,
  verifyPasswordById,
};
