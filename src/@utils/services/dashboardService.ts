import { Query } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

// Ticket trend endpoints
const getDepartmentTicketsPerYear = async (
  deptId: number | undefined,
  params: Query
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/year`,
    { params }
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
    { params }
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

const getUsersTcketsPerYear = async (
  deptId: number | undefined,
  params: Query,
  year: number | undefined
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/user/${deptId}/year/${year}`,
    { params }
  );
};

const getUsersTicketsPerDateRange = async (
  deptId: number | undefined,
  params: {
    statusId?: number;
    dateFrom?: string;
    dateTo?: string;
    groupBy: "day" | "month" | "year";
  }
) => {
  return apiClient.get(`${URI.API_URI}/api/v1/dashboard/user/${deptId}/range`, {
    params,
  });
};

const getCategoryTicketsByDateRange = async (
  categoryId: number | undefined,
  params: {
    statusId?: number;
    dateFrom?: string;
    dateTo?: string;
    groupBy: "day" | "month" | "year";
  }
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/category/${categoryId}/range`,
    { params }
  );
};

const getDepartmentTicketsByDateRange = async (
  deptId: number | undefined,
  params: {
    statusId?: number;
    dateFrom?: string;
    dateTo?: string;
    groupBy: "day" | "month" | "year";
  }
) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/range`,
    { params }
  );
};

// ✅ NEW SERVICES BELOW

// 1. Status Distribution (Pie Chart)
const getTicketCountsByStatus = async (deptId: number | undefined) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/status-count`
  );
};

// 2. SLA Compliance (Donut or Percentage)
const getSLAComplianceReport = async (deptId: number | undefined) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/sla-compliance`
  );
};

// 3. Most Active Users (Bar or Ranking)
const getMostActiveUsers = async (deptId: number | undefined) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/active-users`
  );
};

// 4. Engagement Stats (e.g., comments, reports)
const getCommentAndReportStats = async (deptId: number | undefined) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/ticket-engagement`
  );
};

// 5. On-Hold Tickets
const getOnHoldTickets = async (deptId: number | undefined) => {
  return apiClient.get(
    `${URI.API_URI}/api/v1/dashboard/department/${deptId}/onhold`
  );
};

export {
  getDepartmentTicketsByDateRange,
  getCategoryTicketsByDateRange,
  getUsersTicketsPerDateRange,
  getDepartmentTicketsPerYear,
  getDepartmentTicketsPerMonth,
  getDepartmentTicketsPerDay,
  getCategoriesTicketsPerYear,
  getCategoryTicketsPerMonth,
  getCategoryTicketsPerDay,
  getUsersTcketsPerYear,
  getTicketCountsByStatus,
  getSLAComplianceReport,
  getMostActiveUsers,
  getCommentAndReportStats,
  getOnHoldTickets,
};
