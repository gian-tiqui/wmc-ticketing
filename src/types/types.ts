import { ReactNode } from "react";

type Route = {
  name: string;
  path: string;
  element: ReactNode;
  hidden: boolean;
};

type ButtonType = {
  id: string;
  name: string;
  icon: string;
  path: string;
};

type UserData = {
  sub: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  deptId: number;
  deptName: string;
  deptCode: string;
  roles: { name: string }[];
};

type Query = {
  status?: string;
  search?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  departmentId?: number;
  divisionId?: number;
  name?: string;
  code?: string;
  level?: number;
  sortOrder?: string;
  isDeleted?: boolean;
  roomImageDeleted?: boolean;
  isIncomplete?: boolean;
  startingPoint?: number;
};

type User = {
  firstName: string;
  middleName?: string;
  lastName: string;
  deptId: number;
};

type ChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type Department = {
  id: number;
  name: string;
  code: string;
};

type Question = {
  id: number;
  question: string;
};

type Secrets = { question: string; answer: string };

type ForgotPassword = {
  employeeId: string;
  questionId: number;
  answer: string;
};

type Panel = {
  header: string;
  panel: ReactNode;
  icon: string;
};

export type {
  Panel,
  Route,
  UserData,
  Query,
  Question,
  User,
  ChangePassword,
  Department,
  Secrets,
  ForgotPassword,
  ButtonType,
};
