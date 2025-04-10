import { Query } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const getDepartmentTicketsPerYear = async (
  deptId: number | undefined,
  params: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/year`,
    {
      params,
    }
  );
};

const getDepartmentTicketsPerMonth = async (
  deptId: number | undefined,
  year: number | undefined,
  params: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/year/${year}`,
    { params }
  );
};

const getDepartmentTicketsPerDay = async (
  deptId: number | undefined,
  year: number | undefined,
  month: number | undefined,
  params: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/year/${year}/month/${month}`,
    { params }
  );
};

const getCategoriesTicketsPerYear = async (
  categoryId: number | undefined,
  params: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/category/${categoryId}/year`,
    {
      params,
    }
  );
};

const getCategoryTicketsPerMonth = async (
  categoryId: number | undefined,
  year: number | undefined,
  params: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/category/${categoryId}/year/${year}`,
    { params }
  );
};

const getCategoryTicketsPerDay = async (
  categoryId: number | undefined,
  year: number | undefined,
  month: number | undefined,
  params: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/category/${categoryId}/year/${year}/month/${month}`,
    { params }
  );
};

export {
  getDepartmentTicketsPerYear,
  getDepartmentTicketsPerMonth,
  getDepartmentTicketsPerDay,
  getCategoriesTicketsPerYear,
  getCategoryTicketsPerMonth,
  getCategoryTicketsPerDay,
};
