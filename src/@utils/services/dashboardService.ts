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
  deptId: number,
  year: number,
  month: number,
  params: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/year/${year}/month/${month}`,
    { params }
  );
};

export {
  getDepartmentTicketsPerYear,
  getDepartmentTicketsPerMonth,
  getDepartmentTicketsPerDay,
};
