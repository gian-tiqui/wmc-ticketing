import { UserFormData } from "../../components/AddUserDialog";
import { ChangePassword, Query } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const getUser = async (id: number | null) => {
  return apiClient.get(`${URI.API_URI}/api/v1/user/${id}`);
};

const getUserSecret = async (id: number) => {
  return apiClient.get(`${URI.API_URI}/api/v1/user/${id}/secret`);
};

const updateUserById = async (
  userId: number | null,
  { firstName, middleName, lastName, deptId }: UserFormData
) => {
  return apiClient.patch(`${URI.API_URI}/api/v1/user/${userId}`, {
    firstName,
    middleName,
    lastName,
    deptId: Number(deptId),
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

const getUserTicketsById = async (
  userId: number | undefined,
  params: Query
) => {
  return apiClient.get(`${URI.API_URI}/api/v1/user/${userId}/ticket`, {
    params,
  });
};

const getUserNotificationsById = async (
  userId: number | undefined,
  params: Query
) => {
  return apiClient.get(`${URI.API_URI}/api/v1/user/${userId}/notification`, {
    params,
  });
};

const getUsers = async (params: Query) => {
  return apiClient.get(`${URI.API_URI}/api/v1/user`, { params });
};

const createUser = async (data: UserFormData) => {
  return apiClient.post(`${URI.API_URI}/api/v1/user`, { ...data });
};

export {
  createUser,
  getUser,
  updateUserById,
  changePassword,
  getUserSecret,
  updateUserSecretById,
  verifyPasswordById,
  getUserTicketsById,
  getUserNotificationsById,
  getUsers,
};
