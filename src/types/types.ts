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
  allowedRoles: string[];
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
  statusId?: number;
  deptId?: number;
};

type Category = {
  id: number;
  name: string;
};

type User = {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  deptId: number;

  department: Department;
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

type PriorityLevel = {
  id: number;
  name: string;
};

type CreateTicket = {
  deptId: number;
  categoryId: number;
  priorityLevelId: number;
  title: string;
  description: string;
  reportRequired: number;
};

type Status = {
  id: number;
  type: string;
  createdAt: string;
  updatedAt: string;

  tickets: Ticket[];
};

type Ticket = {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  acknowledgedAt: string;
  reportRequired: boolean;
  closingReason?: string;

  issuerId: number;
  issuer: User;
  assignedUserId: number;
  assignedUser: User;
  statusId: number;
  status: Status;
  deptId: number;
  department: Department;
  categoryId: number;
  category: Category;
  priorityLevelId: number;
  priorityLevel: PriorityLevel;

  serviceReports: ServiceReport[];
  comments: Comment[];
  activities: Activity[];
};

type Activity = {
  id: number;
  activity: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  icon: string;

  ticketId: number;
  ticket: Ticket;
};

type ServiceReport = {
  id: number;
  createdAt: string;
  updatedAt: string;

  ticketId: number;
  ticket: Ticket;
  serviceReporter: User;

  imageLocations: ImageLocation[];
};

type ImageLocation = {
  id: number;
  path: string;
  createdAt: string;
  updatedAt: string;

  fileTypeId: number;
  fileType: FileType;
  serviceReportId: number;
  serviceReport: ServiceReport;
};

type FileType = {
  id: number;
  type: string;
};

type Comment = {
  id: number;
  comment: string;
  createdAt: string;
  updatedAt: string;

  userId: number;
  user: User;
  ticketId: number;
  ticket: Ticket;
  imageLocations: ImageLocation[];
};

type TicketTabs = {
  icon: string;
  name: string;
  component: ReactNode;
};

type SummaryCardType = {
  icon: string;
  summary: string;
  details: string;
};

type TicketsPageTabItems = {
  icon: string;
  header: ReactNode;
  body: ReactNode;
};

type CreateComment = {
  comment: string;
  ticketId: number;
};

type UpdateComment = {
  comment: string;
};

type UpdateTicket = {
  deptId?: number;
  categoryId?: number;
  priorityLevelId?: number;
  title?: string;
  description?: string;
  assignedUserId?: number;
  statusId?: number;
  acknowledgedAt?: Date;
  closingReason?: string;
  resolution?: string;
  resolutionTime?: string;
};

type StatusMarker = {
  name: string;
  disabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  type: string;
  loading: boolean;
  icon?: string;
};

type CustomFile = { file: File; preview: string };

export type {
  FileType,
  CustomFile,
  StatusMarker,
  UpdateTicket,
  UpdateComment,
  CreateComment,
  TicketsPageTabItems,
  SummaryCardType,
  TicketTabs,
  Activity,
  ServiceReport,
  ImageLocation,
  Comment,
  Ticket,
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
  Category,
  PriorityLevel,
  CreateTicket,
};
