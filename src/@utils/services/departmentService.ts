import { DepartmentFormField, Query } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const getDepartments = async (query?: Query) => {
  try {
    const response = await apiClient.get(
      `${URI.API_URI}/api/v1/department?search=${query?.search || ""}&limit=${
        query?.limit || 50
      }`
    );

    if (response.status === 200) {
      const departments = response.data.departments;

      return departments;
    }
  } catch (error) {
    console.error(error);

    return [];
  }
};

const getDepartmentCategoriesByDeptId = async (
  deptId?: number,
  params?: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/department/${deptId}/categories`,
    { params }
  );
};

const getDepartmentUsersByDeptId = async (
  deptId: number | undefined,
  params?: Query
) => {
  return apiClient.get(`${URI.API_URI}/api/v1/department/${deptId}/user`, {
    params,
  });
};

const createDepartment = async (payload: DepartmentFormField) => {
  return apiClient.post(`${URI.API_URI}/api/v1/department`, {
    ...payload,
  });
};

const updateDepartmentById = async (
  deptId: number,
  payload: DepartmentFormField
) => {
  return apiClient.patch(`${URI.API_URI}/api/v1/department/${deptId}`, {
    ...payload,
  });
};

const getDepartmentById = async (deptId: number) => {
  return apiClient.get(`${URI.API_URI}/api/v1/department/${deptId}`);
};

export {
  getDepartments,
  getDepartmentCategoriesByDeptId,
  getDepartmentUsersByDeptId,
  createDepartment,
  updateDepartmentById,
  getDepartmentById,
};
