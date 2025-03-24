import { Query } from "../../types/types";
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

export { getDepartments, getDepartmentCategoriesByDeptId };
